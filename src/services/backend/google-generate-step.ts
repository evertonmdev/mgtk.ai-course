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

        const prompt = obsservation ?
            `Instruções: Não use Markdown, use HTML. Por exemplo, <h1> para títulos, <h2> para subtítulos, <p> para parágrafos, <code> para destacar pastas ou coisas desse gênero. Use a tag <codigo> quando for usar exemplos de codigo ou templates, Use a tag <comando> quando for destacar comandos.
            Não é necessário iniciar com <!DOCTYPE html> e nem com a tag html. Você é um criador de ebooks, vou te pedir Paginas por etapas.
            Importante!: ${obsservation} 
            Importante!: Seja Original em seu conteudo, não é necessário usar codigo se o tema não tem nada haver com codigo
            Importante!: Continue o contexto! não use coisas como "clique aqui para continuar para proxima etapa" ou "clique aqui para ir para a proxima etapa"
        
            Tema do ebook: ${titulo}
            Etapa: ${etapa}
            `
            : `Instruções: Não utilize Markdown. Utilize HTML, por exemplo, <h1> para títulos, <h2> para subtítulos, <p> para parágrafos, <code> para destacar pastas ou coisas desse gênero. Use a tag <codigo> quando for usar exemplos de codigo ou templates, Use a tag <comando> quando for destacar comandos.
            Não é necessário iniciar com <!DOCTYPE html> e nem com a tag html. Você é um criador de ebooks, vou te pedir Paginas por etapas.
            Importante!: Seja Original em seu conteudo, não é necessário usar codigo se o tema não tem nada haver com codigo
            Importante!: Continue o contexto! não use coisas como "clique aqui para continuar para proxima etapa" ou "clique aqui para ir para a proxima etapa"
        
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
