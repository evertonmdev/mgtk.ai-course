"use server";
import { deleteCourse } from "@/services/backend/delete-course";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

interface IContext {
    params: {
        id: string
    }
}

export async function GET(_request: NextRequest, ctx: IContext) {
    const { id } = ctx.params
    await deleteCourse(id)
    revalidatePath("/(app)/")
    return NextResponse.json({ revalidatePath: true, status: "Deleted", now: Date.now() })
}