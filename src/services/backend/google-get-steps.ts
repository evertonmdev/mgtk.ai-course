import { Env } from "@/lib/env";
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";

const MODEL_NAME = Env.MODEL_GOOGLE || "gemini-1.5-flash-latest";
const API_KEY = Env.GOOGLE_API_KEY;

interface GoogleGetStepsProps {
  thema: string;
  observations?: string | null;
}

export async function googleGetSteps({
  thema,
  observations,
}: GoogleGetStepsProps) {
  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
      temperature: 0.1,
      maxOutputTokens: 2048,
    };

    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
    ];

    const systemInstruction = `I would like a numbered list with the sections of an ebook. Rules: Use only plain text, no markdown. Provide only the numbered list, no explanations. Be original in your suggestions.`;
    const prompt = `I'm organizing an ebook about '${thema}'. ${
      observations ? `Important!: ${observations}.` : ""
    } Numbered List`;

    const parts = [{ text: prompt }];
    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig,
      safetySettings,
      systemInstruction,
    });

    const response = result.response;
    const text = response.text();

    const steps = text
      .split("\n")
      .map((step) => step.replace("-", "").trim())
      .filter((step) => step.trim() !== "");
    console.log(steps);
    return steps;
  } catch (error) {
    console.log(error);
    return error;
  }
}
