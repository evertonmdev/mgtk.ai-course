import { Env } from "@/lib/env";
import prisma from '@/lib/prisma';
import {
    GoogleGenerativeAI,
    HarmBlockThreshold,
    HarmCategory,
} from "@google/generative-ai";

const MODEL_NAME = "gemini-pro";
const API_KEY = Env.GOOGLE_API_KEY;


interface GoogleGenerateStepProps {
    stack_id: string;
}

export async function googleGenerateInfos({ stack_id }: GoogleGenerateStepProps) {
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
            temperature: 0.35,
            topK: 40,
            topP: 0.1,
            maxOutputTokens: 5000,
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
            Você deve gerar o titulo e uma descrição para este ebook.
            O titulo deve ser relacionado ao tema do curso.
            A descrição deve ser uma introdução ao conteúdo do ebook.

            use o idioma do ebook/curso
            
            Exemplo de titulo: "Aprenda a criar um ebook"
            Exemplo de descrição: "Neste ebook você vai aprender a criar um ebook, desde a escolha do tema até a publicação."

            Exemplo do output: {
                title: "Aprenda a criar um ebook",
                description: "Neste ebook você vai aprender a criar um ebook, desde a escolha do tema até a publicação."
            }

            output: 
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
        return JSON.parse(response.text()) as {
            title: string;
            description: string;
        };
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    } catch (error: any) {
        console.log(error.message)
        return error;
    }
}
