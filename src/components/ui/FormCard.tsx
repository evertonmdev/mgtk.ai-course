"use client";
import { IFormCourseCreateData } from '@/app/(backend)/api/create-course/route';
import { createCourse } from '@/services/create-course';
import { getStatus } from '@/services/get-status';
import { startStack } from '@/services/start-stack';
import { Button, Card, CardBody, CardHeader, Input, Progress } from '@nextui-org/react';
import { Moon, MoonIcon, Sun, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { RootContext } from '../modules/Contexts/RootContext';


const FormCard: React.FunctionComponent = () => {
    const { triggerReload } = useContext(RootContext)
    const { setTheme, theme } = useTheme()
    const { register, handleSubmit } = useForm<IFormCourseCreateData>()
    const [status, setStatus] = useState({
        error: false,
        success: false,
        status: "Iniciando",
        active: false
    })


    const Sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    const onSubmit = async (data: IFormCourseCreateData) => {
        try {
            setStatus((prev) => ({ ...prev, active: true }))
            const res = await createCourse(data)
            if (res?.stack.id) {
                await startStack({ id: res?.stack?.id })

                for (let i = 0; i < 100; i++) {
                    await Sleep(600)
                    const status = await getStatus({ id: res?.stack?.id })
                    console.log(status)
                    if (status?.status) {
                        setStatus((prev) => ({ ...prev, status: status?.status }))
                    }
                    if (status?.status === "Sucesso!") {
                        setStatus((prev) => ({ ...prev, success: true }))
                        triggerReload()
                        break;
                    }
                }
            }

        } catch (error) {
            console.log(error)
            setStatus((prev) => ({ ...prev, error: true, active: false }))
            toast.error("Lamento, ocorreu um erro ao criar o curso.")
        }

    }

    return (
        <Card className="max-lg:w-full w-1/3 h-fit min-h-[70%] py-10">
            <CardHeader className="w-full justify-between items-center">
                <h3 className="font-bold text-xl text-foreground-600">O que pretende criar hoje?</h3>
                <Button isIconOnly variant="ghost" onClick={() => {
                    if (theme === "light") return setTheme('dark')
                    setTheme("light")
                }}>
                    {
                        theme === "light" ? <MoonIcon /> : <SunIcon />
                    }
                </Button>
            </CardHeader>
            <CardBody>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-start items-center gap-3">
                    {
                        !status.active ? (
                            <>
                                <Input
                                    {...register("tema")}
                                    label="Tema do curso"
                                />
                                <Input
                                    {...register("observacao")}
                                    label="Algum adicional?"
                                />
                            </>
                        ) : (
                            <div className="w-[60%] h-[100px] flex justify-center items-center flex-col">
                                <h2 className="text-xl font-semibold mb-5">{
                                    status.status
                                }</h2>
                                <Progress size="sm" value={
                                    status.status === "Iniciando" ? 0 :
                                        status.status === "Criando passo a passo..." ? 20 :
                                            status.status === "Criando conteudo..." ? 40 :
                                                status.status === "Sucesso!" ? 100 :
                                                    0
                                } />
                            </div>
                        )
                    }
                    <Button
                        isDisabled={status.active}
                        isLoading={status.active}
                        type="submit"
                        color={
                            status.error ? "danger" : status.success ? "success" : "secondary"
                        }
                        variant="flat"
                    >
                        Criar
                    </Button>
                </form>
            </CardBody>
        </Card>

    );
};

export default FormCard;
