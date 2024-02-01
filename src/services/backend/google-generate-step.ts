import { Env } from "@/lib/env";
import {
    GoogleGenerativeAI,
    HarmBlockThreshold,
    HarmCategory,
} from "@google/generative-ai";

const MODEL_NAME = "gemini-pro";
const API_KEY = Env.GOOGLE_API_KEY;


interface GoogleGenerateStepProps {
    etapa: string;
    titulo: string;
    obsservation?: string | null;
}

export async function googleGenerateStep({ etapa, titulo, obsservation }: GoogleGenerateStepProps) {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
        temperature: 0.9,
        topK: 40,
        topP: 0.15,
        maxOutputTokens: 32000,
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

    const prompt = obsservation ?
        `Instruções: Não use Markdown, use html por exemplo <h1> para titulos <h2> para subtitulos <p> para paragrafos e assim por diante você não precisa iniciar com <!DOCTYPE html> e nem da tag html, você é um criador de ebooks, vou te pedir coisas por etapas.\n\nImportante!: ${obsservation}\n\nTema do ebook: ${titulo}\nEtapa: ${etapa} \n\n`
        : `Instruções: Não use Markdown, use html por exemplo <h1> para titulos <h2> para subtitulos <p> para paragrafos e assim por diante você não precisa iniciar com <!DOCTYPE html> e nem da tag html, você é um criador de ebooks, vou te pedir coisas por etapas.\n\nTema do ebook: ${titulo}\nEtapa: ${etapa} \n\n`
    const parts = [
        { text: prompt },
    ];

    const result = await model.generateContent({
        contents: [{ role: "user", parts }],
        generationConfig,
        safetySettings,
    });

    const response = result.response;
    return response.text();
}
