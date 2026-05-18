// const express = require('express');
import express from 'express';
// const cors = require('cors');
import cors from 'cors';
// const dotenv = require('dotenv');
import dotenv from 'dotenv';
// const { z } = require('zod');
import z from 'zod';
// const { GoogleGenerativeAI } = require('@google/generative-ai');
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// В 2026 году Gemini 3 Flash — наш основной движок
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); 

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
    ).length(4) // Ожидаем ровно 4 варианта (как на скринах ЗНО)
  })
);

app.post('/api/generate-test', async (req, res) => {
  const { topic, count = 3 } = req.body;

  const prompt = `
    Generate a test with ${count} questions about "${topic}".
    Language: Ukrainian.
    Structure: Strict JSON array.
    Required fields per object: "text" (string), "explanation" (string), "options" (array of 4 objects with "text" and "isCorrect").
    Ensure exactly one isCorrect: true per question.
  `;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // 1. Очистка от Markdown-мусора
    const cleanJson = responseText.replace(/```json|```/g, "").trim();
    
    // 2. Парсинг
    const rawData = JSON.parse(cleanJson);

    // 3. 🛡️ ВАЛИДАЦИЯ ZOD
    // Если ИИ ошибся в структуре, .parse() выкинет ошибку и мы уйдем в catch
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

    res.json(questionsWithIds);
  } catch (error) {
    console.error("❌ Error/Validation failed:", error.message);
    
    if (error instanceof z.ZodError) {
      res.status(422).json({ error: "AI returned invalid structure", details: error.errors });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`
  🌟 Test AI Server is LIVE!
  📡 Port: ${PORT}
  🛠️ Validation: Zod Active
  🤖 Model: Gemini 3 Flash
  `);
});
