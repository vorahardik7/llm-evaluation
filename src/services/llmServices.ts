import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import Groq from 'groq-sdk';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const openai = new OpenAI({ 
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true 
});
const groq = new Groq({ 
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function getGeminiResponse(prompt: string) {
  const startTime = performance.now();
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(prompt);
  const response = result.response.text();
  const time = (performance.now() - startTime) / 1000;
  return { response, time };
}

export async function getGPT35Response(prompt: string) {
  const startTime = performance.now();
  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-4o",
  });
  const response = completion.choices[0].message.content || '';
  const time = (performance.now() - startTime) / 1000;
  return { response, time };
}

export async function getMistralResponse(prompt: string) {
  const startTime = performance.now();
  const completion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "mixtral-8x7b-32768",
    temperature: 0.7,
    max_tokens: 1024,
  });
  const response = completion.choices[0]?.message?.content || '';
  const time = (performance.now() - startTime) / 1000;
  return { response, time };
}

export async function getLlamaResponse(prompt: string) {
  const startTime = performance.now();
  const completion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama-3.1-8b-instant",
    temperature: 0.7,
    max_tokens: 1024,
  });
  const response = completion.choices[0]?.message?.content || '';
  const time = (performance.now() - startTime) / 1000;
  return { response, time };
} 