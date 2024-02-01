"use server";

import { getStatusStack } from "@/services/backend/get-status-stack";
import { NextRequest, NextResponse } from "next/server";

interface IContext {
    params: {
        id: string
    }
}

export interface IResponseGetStatus {
    status: string
}

export async function GET(request: NextRequest, ctx: IContext) {
    const { id } = ctx.params
    const status = await getStatusStack(id)

    return NextResponse.json({ status })
}