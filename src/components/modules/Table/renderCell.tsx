import { getAllCoursesType } from '@/services/backend/get-all-courses';
import * as React from 'react';
;
import IdContent from './IdContents';
import ActionsColumn from './actionsColumn';
import CreatAtColumn from './createdAtColumn';
import EtapasColumn from './etapasColumn';
import StatusColumn from './statusColumn';

export const useRenderCell = () => {
    const renderCell = React.useCallback((course: getAllCoursesType[0], columnKey: keyof getAllCoursesType[0] | "actions") => {
        switch (columnKey) {
            case "id":
                return (
                    <IdContent id={course.id} />
                )
            case "tema":
                return (
                    <p>{course.tema}</p>
                )
            case "observacao":
                return (
                    <p>{course.observacao || "nenhuma"}</p>
                )
            case "status":
                return (
                    <StatusColumn status={course.status} />
                )
            case "created_at":
                return <CreatAtColumn data={course.created_at} />
            case "etapas":
                return <EtapasColumn etapas={course.etapas} />
            case "actions":
                return <ActionsColumn id={course.id} name={course.tema} />
            default:
                return course?.[columnKey]?.toString() || "N/A"
        }
    }, [])

    return {
        renderCell
    }
}