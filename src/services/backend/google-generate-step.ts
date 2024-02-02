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
    try {

        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });

        const generationConfig = {
            temperature: 0.35,
            topK: 40,
            topP: 0.3,
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
            Importante!: Seja Original em seu conteudo
            
            Tema do ebook: ${titulo}
            Etapa: ${etapa}
            `
            : `Instruções: Não utilize Markdown. Utilize HTML, por exemplo, <h1> para títulos, <h2> para subtítulos, <p> para parágrafos, <code> para destacar pastas ou coisas desse gênero. Use a tag <codigo> quando for usar exemplos de codigo ou templates, Use a tag <comando> quando for destacar comandos.
            Não é necessário iniciar com <!DOCTYPE html> e nem com a tag html. Você é um criador de ebooks, vou te pedir Paginas por etapas.
            Tema do ebook: ${titulo}
            Etapa: ${etapa}
            `
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
    } catch (error) {
        console.log(error);
        return error;
    }
}
