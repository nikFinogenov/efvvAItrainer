import { Hono } from 'hono';
import { cors } from 'hono/cors';
import z from 'zod';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Инициализируем Hono вместо Express
const app = new Hono();

// Включаем CORS (по умолчанию разрешает всё, как и cors() в Express)
app.use('*', cors());

// --- СХЕМА ВАЛИДАЦИИ ZOD ---
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

// Эндпоинт POST. В Hono путь пишется как обычно
app.post('/api/generate-test', async (c) => {
  try {
    // Получаем body запроса (в Hono это асинхронная операция)
    const body = await c.req.json();
    const { topic, count = 3 } = body;

    // Секреты (env) в Cloudflare лежат внутри контекста 'c.env'
    const apiKey = c.env.GEMINI_API_KEY;
    if (!apiKey) {
      return c.json({ error: "GEMINI_API_KEY is not defined in Cloudflare settings" }, 500);
    }

    // Инициализируем Gemini прямо внутри запроса с актуальным ключом
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
    
    // 1. Очистка от Markdown-мусора
    const cleanJson = responseText.replace(/```json|
```/g, "").trim();
    
    // 2. Парсинг
    const rawData = JSON.parse(cleanJson);

    // 3. 🛡️ ВАЛИДАЦИЯ ZOD
    const validatedData = TestSchema.parse(rawData);

    // 4. Обогащение данными (ID)
    const questionsWithIds = validatedData.map((q, qIdx) => ({
      ...q,
      id: Date.now() + qIdx,
      options: q.options.map((opt, oIdx) => ({
        ...opt,
        id: oIdx + 1
      }))
    }));

    // Возвращаем JSON через встроенный метод Hono
    return c.json(questionsWithIds);

  } catch (error: any) {
    console.error("❌ Error/Validation failed:", error.message);
    
    if (error instanceof z.ZodError) {
      return c.json({ error: "AI returned invalid structure", details: error.errors }, 422);
    } else {
      return c.json({ error: "Internal server error", message: error.message }, 500);
    }
  }
});

// Экспортируем воркер по стандарту Cloudflare
export default app;