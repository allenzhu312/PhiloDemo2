// services/geminiService.ts
import { GoogleGenAI, Type } from "@google/genai";
import { Philosopher } from "../types";

// 统一获取 Gemini Client
const getAiClient = () => {
  const apiKey =
    // 推荐的方式：Vite 环境变量
    import.meta.env.VITE_GEMINI_API_KEY ||
    // 兼容你之前可能设置的 GEMINI_API_KEY
    (import.meta as any).env?.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Gemini API key is missing. 请在 .env.local 中设置 VITE_GEMINI_API_KEY。"
    );
  }

  return new GoogleGenAI({ apiKey });
};

// 生成新的哲学家卡片（搜索不到时调用）
export const generateNewPhilosopher = async (
  name: string
): Promise<Philosopher> => {
  const ai = getAiClient();

  const prompt = `Create a detailed profile for the philosopher "${name}".
If the person is not a known philosopher, return a fictional but plausible philosopher profile.
Return a JSON object with the following fields:
- id: unique id in kebab-case based on the name
- name: full display name
- dates: "Birth – Death"
- school: school of thought or tradition
- shortBio: <= 20 words summary
- fullBio: ~100 words overview
- keyIdeas: array of 3–6 short strings
- famousQuotes: array of 2–5 quotations.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          dates: { type: Type.STRING },
          school: { type: Type.STRING },
          shortBio: { type: Type.STRING },
          fullBio: { type: Type.STRING },
          keyIdeas: { type: Type.ARRAY, items: { type: Type.STRING } },
          famousQuotes: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: [
          "id",
          "name",
          "dates",
          "school",
          "shortBio",
          "fullBio",
          "keyIdeas",
          "famousQuotes",
        ],
      },
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("Gemini returned an empty response.");
  }

  const data = JSON.parse(text);

  const randomId = Math.floor(Math.random() * 50) + 1000;

  return {
    ...data,
    id: data.id || name.toLowerCase().replace(/\s+/g, "-"),
    imageUrl: data.imageUrl || `https://picsum.photos/id/${randomId}/400/400`,
    comments: [],
  };
};

// Chat with AI：流式返回哲学家的回答
export const streamPhilosopherChat = async function* (
  philosopherName: string,
  history: { role: string; content: string }[],
  userMessage: string
) {
  const ai = getAiClient();

  const formattedHistory = history.map((h) => ({
    role: h.role,
    parts: [{ text: h.content }],
  }));

  const chat = ai.chats.create({
    model: "gemini-2.5-flash",
    history: formattedHistory,
    config: {
      systemInstruction: `You are ${philosopherName}.
Respond in the first person, using your historical voice and key philosophical ideas.
Be insightful but accessible for high-school and undergraduate students.`,
    },
  });

  const result = await chat.sendMessageStream({ message: userMessage });

  for await (const chunk of result) {
    if (chunk.text) {
      yield chunk.text;
    }
  }
};