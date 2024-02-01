import prisma from "@/lib/prisma";

export const deleteCourse = async (id: string) => {
    const course = await prisma.cursos.delete({
        where: {
            id
        }
    })

    return course
}