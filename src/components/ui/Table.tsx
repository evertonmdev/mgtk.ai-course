"use client";
import { getAllCoursesType } from '@/services/backend/get-all-courses';
import { Skeleton, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react';
import * as React from 'react';

import { RootContext } from '../modules/Contexts/RootContext';
import IdContent from '../modules/Table/IdContents';
import ActionsColumn from '../modules/Table/actionsColumn';
import CreatAtColumn from '../modules/Table/createdAtColumn';
import EtapasColumn from '../modules/Table/etapasColumn';
import StatusColumn from '../modules/Table/statusColumn';


const TableCourses: React.FunctionComponent = (props) => {
  const { courses } = React.useContext(RootContext)
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
        return <ActionsColumn id={course.id} />
      default:
        return course?.[columnKey]?.toString() || "N/A"
    }
  }, [])

  const cols = Object.keys({ ...courses?.[0], actions: null } || {}).filter((col) => col !== "updated_at")


  if (!courses) return <Skeleton className="max-lg:w-full w-2/3 h-[200px] rounded-medium" />
  if (courses.length === 0) return (
    <div className="flex items-center justify-center max-lg:w-full w-2/3 h-full">
      <p className="text-2xl font-semibold text-gray-500">Você ainda não criou nenhum curso</p>
    </div>
  )
  return (
    <>
      <section className="max-lg:w-full w-2/3">
        {
          cols.length > 0 && <Table className="w-full max-h-[70vh] " isStriped >
            <TableHeader>
              {
                cols.map((col, i) => <TableColumn align="center" key={`${i}_${col}`}>{col}</TableColumn>)
              }
            </TableHeader>
            <TableBody emptyContent="Nenhuma task" items={courses || []}>
              {
                (item) => (
                  <TableRow key={item.id} onClick={() => {
                    window.location.href = `/${item.id}`
                  }}>
                    {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
                    {cols.map((col: any, i) => <TableCell align="center" key={`${i}_${col}`}>{renderCell(item, col)}</TableCell>)}
                  </TableRow>
                )
              }
            </TableBody>
          </Table>
        }
      </section>
    </>
  );
};

export default TableCourses;
