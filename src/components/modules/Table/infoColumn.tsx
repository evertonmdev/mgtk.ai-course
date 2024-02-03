import { formatDate } from '@/lib/form-date';
import { getAllCoursesType } from '@/services/backend/get-all-courses';
import { Accordion, AccordionItem, Button, Chip, Tooltip } from '@nextui-org/react';
import * as React from 'react';

type IInfoColumnProps = {
  course: getAllCoursesType[0]
}

const InfoColumn: React.FunctionComponent<IInfoColumnProps> = ({ course }) => {
  const [toolIsOpen, setToolIsOpen] = React.useState(false)
  const handleOpenClick = () => setToolIsOpen(true)
  const handleCloseClick = () => setToolIsOpen(false)
  return (
    <>
      <Tooltip isOpen={toolIsOpen} placement='bottom' size='sm' className='bg-transparent shadow-none' content={
        <Accordion
          className="p-2 flex flex-col gap-1 max-md:w-[85vw] w-[300px]"
          variant="shadow"
          itemClasses={{
            base: "py-0 w-full",
            title: "font-semibold text-small",
            trigger: "px-2 py-0 data-[hover=true]:bg-default-100 rounded-lg h-10 flex items-center",
            indicator: "text-medium",
            content: "text-small px-2"
          }}
        >
          <AccordionItem title="Titulo">
            {course.title}
          </AccordionItem>
          <AccordionItem title="Descrição">
            {course.descricao}
          </AccordionItem>
          <AccordionItem title="Adicionais">
            {course.observacao}
            <div className='w-full mt-3'>
              <p>
                <b>Criado Em:</b> {formatDate(course.created_at)}
              </p>
              <p>
                <b>ID:</b> {course.id}
              </p>
            </div>
          </AccordionItem>
        </Accordion>
      }>
        {
          toolIsOpen ? <Chip className='cursor-pointer' onClick={handleCloseClick} color="danger" variant='flat'>
            Fechar
          </Chip> :
            <Chip onClick={handleOpenClick} className='cursor-pointer' color="secondary" variant='flat'>
              {course.title ? "Ler mais" : "Carregando..."}
            </Chip>
        }

      </Tooltip>
    </>
  );
};

export default InfoColumn;
