"use server";

import prisma from "@/lib/prisma";
import { googleGenerateStep } from "@/services/backend/google-generate-step";
import { googleGetSteps } from "@/services/backend/google-get-steps";
import { NextRequest, NextResponse } from "next/server";


export interface IRequestBodyStack {
    id: string
}


export async function POST(request: NextRequest) {
    const body = await request.json() as IRequestBodyStack
    if (!body?.id) return NextResponse.json({ status: "id é obrigatório" })

    startStack({ id: body.id })
    return NextResponse.json({ status: "iniated" })
}


async function startStack({ id }: { id: string }) {
    const stack = await prisma.cursos.findUnique({
        where: {
            id
        },
    })

    if (stack === null) return console.log("Stack não encontrado");

    const steps = await googleGetSteps({ thema: stack.tema, observations: stack.observacao })

    console.log("Iniciando criação de etapas")

    await prisma.cursos.update({
        where: {
            id: stack.id
        },
        data: {
            status: "Criando passo a passo..."
        }
    })

    for (const step of steps) {
        await prisma.etapas.create({
            data: {
                curso_id: stack.id,
                nome: step,
            },
        });
    }

    console.log("Etapas criada com sucesso")
    await prisma.cursos.update({
        where: {
            id: stack.id
        },
        data: {
            status: "Criando conteudo..."
        }
    })

    const etapas = await prisma.etapas.findMany({
        where: {
            curso_id: stack.id
        },
        orderBy: {
            created_at: "asc"
        }
    })

    console.log(etapas.map(e => e.nome))

    console.log("Iniciando criação do conteudo das etapas")

    await Promise.all(
        etapas.map(async (e) => {
            const conteudo = await googleGenerateStep({ etapa: e.nome, titulo: stack.tema, obsservation: stack.observacao })
            return await prisma.etapas.update({
                where: {
                    id: e.id
                },
                data: {
                    texto: conteudo
                }
            })
        }),
    )

    await prisma.cursos.update({
        where: {
            id: stack.id
        },
        data: {
            status: "Sucesso!"
        }
    })

    console.log("Conteudo das etapas criado com sucesso")
}
