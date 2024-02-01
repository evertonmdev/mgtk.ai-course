import { Env } from "@/lib/env";
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

const MODEL_NAME = "gemini-pro";
const API_KEY = Env.GOOGLE_API_KEY;

interface GoogleGetStepsProps {
    thema: string;
    observations?: string | null;
}

export async function googleGetSteps({ thema, observations }: GoogleGetStepsProps) {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
        temperature: 0,
        topK: 40,
        topP: 0,
        maxOutputTokens: 1028,
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

    const prompt = observations ?
        `Estou criando um ebook sobre '${thema}', me traga uma lista com as seções do ebook.\nnão use markdown, apenas texto puro\nme traga apenas a lista, não precisa me explicar o porque e mantenha a lista numerada\n\nExemplo: Introdução, Desenvolvimento, etc...\n\nImportante!: ${observations}\n\nLista: \n`
        : `Estou criando um ebook sobre '${thema}', me traga uma lista com as seções do ebook.\nnão use markdown, apenas texto puro\nme traga apenas a lista, não precisa me explicar o porque e mantenha a lista numerada\n\nExemplo: Introdução, Desenvolvimento, etc...\n\nLista: \n`
    const parts = [
        { text: prompt },
    ];
    const result = await model.generateContent({
        contents: [{ role: "user", parts }],
        generationConfig,
        safetySettings,
    });

    const response = result.response;
    const text = response.text();

    const steps = text.split("\n").map((step) => step.replace("-", "").trim()).filter((step) => step.trim() !== "");
    console.log(steps)
    return steps
}