"use server";

import prisma from "@/lib/prisma";
import { googleGenerateInfos } from "@/services/backend/google-generate-infos";
import { googleGenerateStep } from "@/services/backend/google-generate-step";
import { googleGetSteps } from "@/services/backend/google-get-steps";
import chalk from "chalk";
import { NextRequest, NextResponse } from "next/server";


export interface IRequestBodyStack {
    id: string
}

export type IStackStatus = "Criando passo a passo..." | "Criando conteudo..." | "Sucesso!" | "Falhou" | string

export async function POST(request: NextRequest) {
    const body = await request.json() as IRequestBodyStack
    if (!body?.id) return NextResponse.json({ status: "id é obrigatório" })

    startStack({ id: body.id })
    return NextResponse.json({ status: "iniated", revalidatePath: true, now: Date.now() })
}


async function startStack({ id }: { id: string }) {
    const stack = await prisma.cursos.findUnique({
        where: {
            id
        },
    })
    if (stack === null) return console.log("Stack não encontrado");

    try {
        const steps = await googleGetSteps({ thema: stack.tema, observations: stack.observacao }) as string[]

        await updateStackStatus({ id: stack.id, status: "Criando passo a passo..." })

        for (const step of steps) {
            await prisma.etapas.create({
                data: {
                    curso_id: stack.id,
                    nome: step,
                },
            });
        }

        await updateStackStatus({ id: stack.id, status: "Criando conteudo..." })

        const etapas = await prisma.etapas.findMany({
            where: {
                curso_id: stack.id
            },
            orderBy: {
                created_at: "asc"
            }
        })

        console.log(etapas.map(e => e.nome))

        for (const etapa in etapas) {
            await createContent({
                id: etapas[etapa].id,
                nome_etapa: etapas[etapa].nome,
                observacao: stack.observacao,
                tema: stack.tema,
                stack_id: stack.id
            })

            if (parseInt(etapa) === etapas.length - 1) {
                await googleGenerateInfos({ stack_id: stack.id }).then(async response => {
                    await prisma.cursos.update({
                        where: {
                            id: stack.id
                        },
                        data: {
                            title: response.title,
                            descricao: response.description
                        }
                    })
                }).catch(error => {
                    console.log(error)
                })
            }
        }

        await updateStackStatus({ id: stack.id, status: "Sucesso!" })
    } catch (error) {
        console.log(error);
        await updateStackStatus({ id: stack.id, status: "Falhou" })
        return error;
    }
}


async function createContent({
    nome_etapa,
    tema,
    observacao,
    id,
    stack_id,
}: {
    nome_etapa: string;
    tema: string;
    observacao: string | null;
    id: number;
    stack_id: string;
}): Promise<boolean> {
    try {
        let temperature: number | undefined;
        await updateStackStatus({ id: stack_id, status: `Criando conteúdo da etapa ${nome_etapa}` });
        for (let attempt = 0; attempt < 5; attempt++) {

            if (attempt > 0) {
                if (attempt === 1) temperature = 0.4;
                else if (typeof temperature === "number") temperature += 0.05;
                console.log(chalk.yellow(`Tentativa ${attempt + 1} de criar conteúdo da etapa ${nome_etapa}, aumentando temperatura para ${chalk.green(temperature)}`));
            }

            const response = await googleGenerateStep(
                { etapa: nome_etapa, titulo: tema, obsservation: observacao, stack_id, temperature }
            );

            if (response === null) continue;

            try {
                await prisma.etapas.update({
                    where: { id },
                    data: { texto: response },
                });

                return true; // Conteudo gerado com sucesso
                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            } catch (error: any) {
                console.error("Falha ao atualizar conteúdo da etapa", nome_etapa, error.message);
            }
        }

        throw new Error(`Falha ao gerar conteúdo da etapa ${nome_etapa} após 5 tentativas`);
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    } catch (error: any) {
        throw new Error(`Falha ao criar conteúdo da etapa ${nome_etapa}: ${error.message}`);
    }
}

async function updateStackStatus({ id, status }: { id: string, status: IStackStatus }) {
    console.log("Atualizando status do stack", id, status)
    await prisma.cursos.update({
        where: {
            id
        },
        data: {
            status
        }
    })

    return true
}