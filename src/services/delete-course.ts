import { api } from "@/lib/api";

export const deleteCourse_C = async ({ id }: { id: string }) => {
    try {
        const { data } = await api.get(`${id}/delete`);
        console.log(data)
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}