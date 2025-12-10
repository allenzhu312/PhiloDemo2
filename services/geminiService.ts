import { GoogleGenAI, Type } from "@google/genai";
import { Philosopher } from '../types';

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY environment variable is missing.");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateNewPhilosopher = async (name: string): Promise<Philosopher> => {
  const ai = getAiClient();
  const prompt = `Create a detailed profile for the philosopher "${name}". If the person is not a known philosopher, return a fictional but plausible philosopher profile. 
  Provide:
  1. A unique ID (kebab-case name).
  2. Name.
  3. Dates (Birth - Death).
  4. School of thought.
  5. Short Bio (max 20 words).
  6. Full Bio (approx 100 words).
  7. Key Ideas (array of strings).
  8. Famous Quotes (array of strings).
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
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
        required: ["id", "name", "dates", "school", "shortBio", "fullBio", "keyIdeas", "famousQuotes"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");

  const data = JSON.parse(text);
  
  // Assign a random placeholder image
  const randomId = Math.floor(Math.random() * 50) + 1000;
  
  return {
    ...data,
    imageUrl: `https://picsum.photos/id/${randomId}/400/400`,
    comments: []
  };
};

export const streamPhilosopherChat = async function* (philosopherName: string, history: {role: string, content: string}[], userMessage: string) {
  const ai = getAiClient();
  
  const formattedHistory = history.map(h => ({
    role: h.role,
    parts: [{ text: h.content }]
  }));

  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    history: formattedHistory,
    config: {
      systemInstruction: `You are ${philosopherName}. Respond to the user's questions in the first person, adopting your philosophical persona, tone, and specific vocabulary. Be insightful but accessible.`,
    }
  });

  const result = await chat.sendMessageStream({ message: userMessage });

  for await (const chunk of result) {
      if (chunk.text) {
          yield chunk.text;
      }
  }
};