import prisma from "@/lib/prisma";

export const getStatusStack = async (id: string) => {
    const stack = await prisma.cursos.findUnique({
        where: {
            id
        }
    })

    if (stack === null) {
        console.log("Stack não encontrado")
        return null
    }


    return stack.status
}