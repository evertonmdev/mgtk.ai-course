"use client";
import { getAllCoursesType } from "@/services/backend/get-all-courses";
import { getAllCourses_C } from "@/services/get-all";
import React, { createContext } from "react";

interface IRootContext {
    reload: boolean
    courses: getAllCoursesType | null
    setCourses: React.Dispatch<React.SetStateAction<getAllCoursesType | null>>
    triggerReload: () => void
}
interface IRootContextProvider {
    children: React.ReactNode
}

export const RootContext = createContext({} as IRootContext)

export const RootContextProvider: React.FC<IRootContextProvider> = ({ children }) => {
    const [courses, setCourses] = React.useState<getAllCoursesType | null>(null)

    React.useEffect(() => {
        getAllCourses_C().then((data) => {
            return setCourses(data);
        }).catch(err => {
            console.log(err)
        })
    }, [])

    const triggerReload = () => {
        getAllCourses_C().then((data) => {
            setCourses(data);
        }
        ).catch(err => {
            console.log(err)
        })
    }

    const values = {
        courses,
        setCourses,
        triggerReload
    } as IRootContext


    return (
        <RootContext.Provider value={values}>
            {children}
        </RootContext.Provider>
    )
}