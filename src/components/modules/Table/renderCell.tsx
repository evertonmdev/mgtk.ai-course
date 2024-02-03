import { getAllCoursesType } from '@/services/backend/get-all-courses';
import * as React from 'react';

import { formatDate } from '@/lib/form-date';
import { Accordion, AccordionItem, Chip, Tooltip } from '@nextui-org/react';
import ActionsColumn from './actionsColumn';
import EtapasColumn from './etapasColumn';
import InfoColumn from './infoColumn';
import StatusColumn from './statusColumn';

export const useRenderCell = () => {
    const renderCell = React.useCallback((course: getAllCoursesType[0], columnKey: "tema" | "informacoes" | "actions" | "etapas" | "status") => {
        switch (columnKey) {
            case "informacoes":
                return <InfoColumn course={course} />
            case "tema": {
                return (
                    <Tooltip
                        closeDelay={0}
                        content={course.tema}
                    >
                        <p className="line-clamp-2">
                            {course.tema}
                        </p>
                    </Tooltip>
                );
            }
            case "status":
                return (
                    <StatusColumn status={course.status} />
                )
            case "etapas":
                return <EtapasColumn etapas={course.etapas} />
            case "actions":
                return <ActionsColumn id={course.id} name={course.tema} />
            default:
                return course?.[columnKey] || "N/A"
        }
    }, [])

    return {
        renderCell
    }
}