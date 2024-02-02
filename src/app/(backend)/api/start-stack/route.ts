"use server";

import prisma from "@/lib/prisma";
import { googleGenerateStep } from "@/services/backend/google-generate-step";
import { googleGetSteps } from "@/services/backend/google-get-steps";
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

        let stacks_queue = []

        for (const etapa of etapas) {
            console.log("Criando conteudo da etapa", etapa.nome)
            stacks_queue.push(createContent({
                id: etapa.id,
                nome_etapa: etapa.nome,
                observacao: stack.observacao,
                tema: stack.tema,
                stack_id: stack.id
            }))

            if (stacks_queue.length >= 3) {
                await Promise.all(stacks_queue)
                stacks_queue = []
            }
        }

        await Promise.all(stacks_queue)
        await updateStackStatus({ id: stack.id, status: "Sucesso!" })
    } catch (error) {
        console.log(error);
        await updateStackStatus({ id: stack.id, status: "Falhou" })
        return error;
    }
}


async function createContent({ nome_etapa, tema, observacao, id, stack_id }: { nome_etapa: string, tema: string, observacao: string | null, id: number, stack_id: string }) {
    await updateStackStatus({ id: stack_id, status: `Criando conteudo da etapa ${nome_etapa}` })
    const conteudo = await googleGenerateStep({ etapa: nome_etapa, titulo: tema, obsservation: observacao }) as string
    await prisma.etapas.update({
        where: {
            id
        },
        data: {
            texto: conteudo
        }
    })

    return true
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