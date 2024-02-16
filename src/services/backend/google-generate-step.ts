import { Env } from "@/lib/env";
import prisma from '@/lib/prisma';
import {
    GoogleGenerativeAI,
    HarmBlockThreshold,
    HarmCategory,
} from "@google/generative-ai";

const MODEL_NAME = "gemini-1.0-pro-latest";
const API_KEY = Env.GOOGLE_API_KEY;


interface GoogleGenerateStepProps {
    etapa: string;
    titulo: string;
    obsservation?: string | null;
    stack_id: string;
    temperature?: number;
}

export async function googleGenerateStep({ etapa, titulo, obsservation, stack_id, temperature }: GoogleGenerateStepProps) {
    try {
        const old_data = await prisma.etapas.findMany({
            where: {
                curso_id: stack_id
            },
            orderBy: {
                created_at: "asc"
            }
        })

        let old_data_text = ""

        if (old_data) old_data_text = old_data.map(e => e.texto).filter((e) => e && e).join('<br>')

        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });

        const generationConfig = {
            temperature: temperature ? temperature : 0.35,
            topK: 40,
            topP: temperature ? (temperature / 10) : 0.1,
            maxOutputTokens: 20000,
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

        const prompt = `
        Please act like an expert in writing ebooks. You are uniquely capable of generating impeccable ebooks on any subject, using the specific language I provide. Create an ebook based on my topic, strictly following my observations. Respond in a structured way, including:
        
        Topic: ${titulo}
        Chapter: ${etapa}
        ${obsservation ? `Observations: Incorporate these additional observations: ${obsservation}` : ''}
        
        Important!!: Be original, creative and concise
        Important!!: Use HTML to format the text according to the following guidelines: <h1> for headings , <h2> for subheadings , <p> for paragraphs , <code> to highlight folders or commands. Use the <codigoxx> tag when presenting code examples or templates, and <comandoxx> to highlight commands.

        Remember: Use HTML to format the text according to the following guidelines: <h1> for headings , <h2> for subheadings , <p> for paragraphs , <code> to highlight folders or commands. Use the <codigoxx> tag when presenting code examples or templates, and <comandoxx> to highlight commands.
        `

        const parts = [
            { text: `${old_data_text} \n\n ${prompt}` },
        ];

        const result = await model.generateContent({
            contents: [{ role: "user", parts }],
            generationConfig,
            safetySettings,
        });

        const response = result.response;
        return response.text();
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    } catch (error: any) {
        console.log(error.message)
        return error;
    }
}
