"use server";
import { getAllCourses } from "@/services/backend/get-all-courses";
import { NextResponse } from "next/server";

export async function GET() {
    const all = await getAllCourses()

    return NextResponse.json(all)
}