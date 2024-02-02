import { IStackStatus } from "@/app/(backend)/api/start-stack/route";
import prisma from "@/lib/prisma";

export const getAllCourses = async () => {
    const stack = await prisma.cursos.findMany({
        orderBy: {
            created_at: "asc"
        },
        include: {
            etapas: true
        }
    }) || null

    return stack as getAllCoursesType | null
}

export type getAllCoursesType = ({
    etapas: {
        id: number;
        nome: string;
        texto: string;
        curso_id: string;
        created_at: Date;
    }[];
} & {
    id: string;
    tema: string;
    observacao: string;
    status: IStackStatus;
    created_at: Date;
    updated_at: Date;
})[]