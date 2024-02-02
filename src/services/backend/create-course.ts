import { IFormCourseCreateData } from "@/app/(backend)/api/create-course/route";
import prisma from "@/lib/prisma";

export const createCourse = async (data: IFormCourseCreateData) => {
    try {
        const stack = await prisma.cursos.create({
            data
        })

        return stack
    } catch (err) {
        console.error(err)
        return null
    }
}