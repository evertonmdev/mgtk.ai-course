"use client";
import { Skeleton, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react';
import * as React from 'react';

import { RootContext } from '../modules/Contexts/RootContext';
import { useRenderCell } from '../modules/Table/renderCell';


const TableCourses: React.FunctionComponent = () => {
  const { courses } = React.useContext(RootContext)
  const { renderCell } = useRenderCell()
  // const cols = Object.keys({ ...courses?.[0], informacoes: null, actions: null } || {}).filter((col) => {
  //   return col !== "id" && col !== "updated_at" && col !== "descricao" && col !== "title" && col !== "observacao" && col !== "created_at"
  // })

  const cols = [
    "tema",
    "etapas",
    "informacoes",
    "status",
    "actions",
  ]

  const refdiv = React.useRef<HTMLElement>(null)

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  React.useEffect(() => {
    if (refdiv.current) {
      refdiv?.current?.scrollIntoView({ behavior: "smooth", block: "end", inline: "end" })
    }
  }, [refdiv?.current])

  if (!courses) return <Skeleton className="max-lg:w-full w-2/3 h-[200px] rounded-medium" />
  if (courses.length === 0) return (
    <div className="flex items-center justify-center max-lg:w-full w-2/3 h-full">
      <p className="text-2xl font-semibold text-gray-500">Você ainda não criou nenhum curso</p>
    </div>
  )

  return (
    <section className="max-lg:w-full w-2/3">
      {
        cols.length > 0 && <Table ref={refdiv} className="w-full max-h-[70vh] " isStriped >
          <TableHeader>
            {
              cols.map((col, i) => <TableColumn align="center" key={`${i}_${col}`}>{col}</TableColumn>)
            }
          </TableHeader>

          <TableBody emptyContent="Nenhuma task" items={courses || []}>
            {
              (item) => (
                <TableRow key={item.id}>
                  {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
                  {cols.map((col: any, i) => <TableCell align="center" key={`${i}_${col}`}>{renderCell(item, col)}</TableCell>)}
                </TableRow>
              )
            }
          </TableBody>
        </Table>
      }
    </section>

  );
};

export default TableCourses;
