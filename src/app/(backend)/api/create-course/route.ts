"use server";
import { createCourse } from "@/services/backend/create-course";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";


export type IFormCourseCreateData = {
    tema: string;
    observacao: string;
}

export interface IResponseCreateCourse {
    stack: {
        id: string;
        tema: string;
        observacao: string;
        status: string;
        created_at: Date;
        updated_at: Date;
    }
}

export async function POST(request: NextRequest) {
    const body = await request.json() as IFormCourseCreateData

    if (!body.tema) {
        return NextResponse.json({ ok: false, error: "tema é obrigatório" })
    }

    const data = { tema: body.tema } as IFormCourseCreateData
    if (body.observacao) data.observacao = body.observacao

    const stack = await createCourse(data)
    return NextResponse.json({ revalidatePath: true, stack, now: Date.now() })
}