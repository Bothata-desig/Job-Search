
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { ResumeAnalysis } from "../types";

const API_KEY = process.env.API_KEY || "";

export const getGeminiClient = () => {
  return new GoogleGenAI({ apiKey: API_KEY });
};

export const analyzeResume = async (resumeText: string): Promise<ResumeAnalysis> => {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze this resume and provide feedback for improvement: \n\n${resumeText}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER, description: "A score from 0-100" },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
          suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["score", "strengths", "weaknesses", "suggestions"],
      },
    },
  });

  try {
    return JSON.parse(response.text || "{}") as ResumeAnalysis;
  } catch (e) {
    console.error("Failed to parse resume analysis", e);
    throw e;
  }
};

export const getCareerAdvice = async (query: string, history: { role: string; parts: { text: string }[] }[]) => {
  const ai = getGeminiClient();
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: "You are an empathetic, professional career coach named Elevate AI. Your goal is to help unemployed individuals find motivation, clarify their career paths, and provide actionable advice on job searching, networking, and skills. Be supportive but realistic.",
    },
  });

  // Reconstruct history if needed or just send message
  const result = await chat.sendMessage({ message: query });
  return result.text;
};
