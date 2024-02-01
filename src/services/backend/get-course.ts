'use server';
import prisma from "@/lib/prisma";

export const getCourse = async ({ id }: { id: string }) => {
    const item = await prisma.cursos.findUnique({
        where: {
            id
        },
        include: {
            etapas: {
                orderBy: {
                    created_at: "asc",
                },
            }
        }
    })
    return item;
};
