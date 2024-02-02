"use server";

import { getStatusStack } from "@/services/backend/get-status-stack";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

interface IContext {
    params: {
        id: string
    }
}

export interface IResponseGetStatus {
    status: string
}

export async function GET(_request: NextRequest, ctx: IContext) {
    const { id } = ctx.params
    const status = await getStatusStack(id)

    if (status === "Sucesso!") {
        revalidatePath("/(app)/")
        return NextResponse.json({ revalidatePath: true, status, now: Date.now() })
    }

    return NextResponse.json({ revalidatePath: false, status, now: Date.now() })
}