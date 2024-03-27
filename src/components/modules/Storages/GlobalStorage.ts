import { getAllCoursesType } from "@/services/backend/get-all-courses";
import { getAllCourses_C } from "@/services/client/get-all";
import { create } from "zustand";

interface IGlobalStorage {
	courses: getAllCoursesType | null;
	setCourses: (courses: IGlobalStorage["courses"]) => void;
	triggerReload: () => Promise<void>;
}

const useGlobalStorage = create<IGlobalStorage>((set, get) => ({
	courses: null,
	setCourses: (courses) => {
		set({ courses });
	},
	triggerReload: async () => {
		return getAllCourses_C()
			.then((data) => {
				set({
					courses: data,
				});
				return Promise.resolve();
			})
			.catch((err) => {
				console.log(err);
				return Promise.reject();
			});
	},
}));

export default useGlobalStorage;
