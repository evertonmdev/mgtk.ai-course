"use server";
import { deleteCourse } from "@/services/backend/delete-course";
import { NextRequest, NextResponse } from "next/server";

interface IContext {
    params: {
        id: string
    }
}

export async function GET(request: NextRequest, ctx: IContext) {
    const { id } = ctx.params
    await deleteCourse(id)
    return NextResponse.json({ status: "Deleted" })
}