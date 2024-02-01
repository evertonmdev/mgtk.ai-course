import { api } from "@/lib/api";
import { getAllCoursesType } from "./backend/get-all-courses";


export const getAllCourses_C = async () => {
    try {
        const { data } = await api.get("/get-all");
        return data as getAllCoursesType;
    } catch (error) {
        console.error(error);
        return null;
    }
}