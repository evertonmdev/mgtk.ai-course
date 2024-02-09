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
            maxOutputTokens: 10000,
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

        const prompt = `Instruções: Utilize HTML para formatar o texto conforme as seguintes diretrizes: <h1> para títulos, <h2> para subtítulos, <p> para parágrafos, <code> para destacar pastas ou comandos. Use a tag <codigo> ao apresentar exemplos de código ou templates, e <comando> para destacar comandos.

        Lembre-se das seguintes orientações:
        
        Evite repetir conteúdo em excesso entre as páginas para manter o interesse do leitor.
        Seja original e criativo em seu conteúdo, adaptando-o ao tema proposto.
        Mantenha o contexto ao transitar entre as etapas do ebook.
        Não utilize código se o tema não estiver relacionado a esse contexto.
        Evite instruções genéricas ou sem propósito direto.
        Não é necessário iniciar com <!DOCTYPE html> e nem com a tag html.
        ${obsservation ? `Importante!: ${obsservation}` : ''}
        
        Tema do ebook: ${titulo}
        Etapa: ${etapa} 
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
