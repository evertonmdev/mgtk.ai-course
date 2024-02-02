"use client";
import { IFormCourseCreateData, IResponseCreateCourse } from "@/app/(backend)/api/create-course/route";
import { api } from "@/lib/api";

export async function createCourse_C({ observacao, tema }: IFormCourseCreateData) {
    try {
        const { data } = await api.post("/create-course", {
            observacao,
            tema,
        });


        return data as IResponseCreateCourse;
    } catch (error) {
        console.error(error);
        return null;
    }
}