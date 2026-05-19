import { Hono } from 'hono';
import { cors } from 'hono/cors';
import z from 'zod';
import { GoogleGenerativeAI } from '@google/generative-ai';


type Bindings = {
  GEMINI_API_KEY: string;
};
const app = new Hono<{ Bindings: Bindings }>();

app.use('*', cors());

const TestSchema = z.array(
  z.object({
    text: z.string().min(5),
    explanation: z.string().min(10),
    options: z.array(
      z.object({
        text: z.string().min(1),
        isCorrect: z.boolean()
      })
    ).length(4)
  })
);

app.post('/api/generate-test', async (c) => {
  try {
    const body = await c.req.json();
    const { topic, count = 3 } = body;

    const apiKey = c.env.GEMINI_API_KEY;
    if (!apiKey) {
      return c.json({ error: "GEMINI_API_KEY is not defined in Cloudflare settings" }, 500);
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); 

    const prompt = `
      Generate a test with ${count} questions about "${topic}".
      Language: Ukrainian.
      Structure: Strict JSON array.
      Required fields per object: "text" (string), "explanation" (string), "options" (array of 4 objects with "text" and "isCorrect").
      Ensure exactly one isCorrect: true per question.
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    const cleanJson = responseText.replace(/```json|```/g, "").trim();
    
    const rawData = JSON.parse(cleanJson);

    const validatedData = TestSchema.parse(rawData);

    const questionsWithIds = validatedData.map((q, qIdx) => ({
      ...q,
      id: Date.now() + qIdx,
      options: q.options.map((opt, oIdx) => ({
        ...opt,
        id: oIdx + 1
      }))
    }));

    return c.json(questionsWithIds);

  } catch (error: any) {
    console.error("❌ Error/Validation failed:", error.message);
    
    if (error instanceof z.ZodError) {
      return c.json({ error: "AI returned invalid structure", details: error.issues }, 422);
    } else {
      return c.json({ error: "Internal server error", message: error.message }, 500);
    }
  }
});

export default app;