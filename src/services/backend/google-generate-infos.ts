import { Env } from "@/lib/env";
import prisma from "@/lib/prisma";
import {
	GoogleGenerativeAI,
	HarmBlockThreshold,
	HarmCategory,
} from "@google/generative-ai";

const MODEL_NAME = Env.MODEL_GOOGLE || "gemini-1.0-pro-latest";
const API_KEY = Env.GOOGLE_API_KEY;

interface GoogleGenerateStepProps {
	stack_id: string;
}

export async function googleGenerateInfos({
	stack_id,
}: GoogleGenerateStepProps) {
	try {
		const data = await prisma.cursos.findUnique({
			where: {
				id: stack_id,
			},
		});

		const old_data = await prisma.etapas.findMany({
			where: {
				curso_id: stack_id,
			},
			orderBy: {
				created_at: "asc",
			},
		});

		let old_data_text = "";

		if (old_data)
			old_data_text = old_data
				.map((e) => e.texto)
				.filter((e) => e && e)
				.join("<br>");

		const genAI = new GoogleGenerativeAI(API_KEY);
		const model = genAI.getGenerativeModel({ model: MODEL_NAME });

		const generationConfig = {
			temperature: 0.35,
			topK: 20,
			topP: 0.1,
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

		const prompt = `
        You must generate the title and a description for this ebook.
        The title should be related to the theme of the course.
        The description should be an introduction to the content of the ebook.

        use the language of the ebook/course

        Theme: ${data?.tema} 
        Important!: Generate a valid JSON!
        Important!: ${data?.observacao || "nothing"}
        
        Example title: "Learn how to create an ebook"
        Example description: "In this ebook you will learn how to create an ebook, from choosing the topic to publishing it."

        Sample output: {
            title: "Learn how to create an ebook",
            description: "In this ebook you will learn how to create an ebook, from choosing the topic to publishing it."
        }

        output:
        `;

		const parts = [{ text: `${old_data_text} \n\n ${prompt}` }];

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
		console.log(error.message);
		return error;
	}
}
