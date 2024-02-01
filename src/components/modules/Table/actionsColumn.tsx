import { deleteCourse_C } from '@/services/delete-course';
import { Button, Tooltip } from '@nextui-org/react';
import { Download, Trash } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';
import { RootContext } from '../Contexts/RootContext';

interface IActionsColumnProps {
    id: string;
}

const ActionsColumn: React.FunctionComponent<IActionsColumnProps> = ({ id }) => {
    const { triggerReload } = React.useContext(RootContext)
    return (
        <div className='w-full flex gap-1 justify-center items-center'>
            <Tooltip content="Deletar" color='danger'>

                <Button onClick={() => {
                    toast.info("Você tem certeza que deseja excluir esse curso?", {
                        action: {
                            label: "Sim",
                            onClick: () => {
                                deleteCourse_C({ id }).then(() => {
                                    triggerReload()
                                    toast.success("Curso excluído com sucesso!")
                                }).catch(e => {
                                    toast.error("Ocorreu um erro ao excluir o curso")
                                })
                            }
                        },
                        cancel: {
                            label: "Não",
                            onClick: () => {
                                toast.success("Ação cancelada!")
                            }
                        },

                    })
                }} size="sm" isIconOnly color="danger" variant="flat" >
                    <Trash size={15} />
                </Button>
            </Tooltip>
            <Tooltip content="Baixar" color='secondary'>
                <Button onClick={() => {
                    toast.info("Download iniciado!")
                }} size="sm" isIconOnly color="secondary" variant="flat" >
                    <Download size={15} />
                </Button>
            </Tooltip>
        </div>
    );
};

export default ActionsColumn;