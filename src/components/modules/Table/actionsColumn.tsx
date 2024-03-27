import { deleteCourse_C } from "@/services/client/delete-course";
import { downloadCourse_C } from "@/services/client/download-course";
import { Button, Tooltip } from "@nextui-org/react";
import { BookOpen, Download, Trash } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import useGlobalStorage from "../Storages/GlobalStorage";

interface IActionsColumnProps {
	id: string;
	name: string;
}

const ActionsColumn: React.FunctionComponent<IActionsColumnProps> = ({
	id,
	name,
}) => {
	const { triggerReload } = useGlobalStorage();
	return (
		<div className="w-full flex gap-1 justify-start items-center">
			<Tooltip content="Deletar" color="danger">
				<Button
					onClick={() => {
						toast.info("Você tem certeza que deseja excluir esse curso?", {
							action: {
								label: "Sim",
								onClick: () => {
									deleteCourse_C({ id })
										.then(() => {
											triggerReload();
											toast.success("Curso excluído com sucesso!");
										})
										.catch((e) => {
											toast.error("Ocorreu um erro ao excluir o curso");
										});
								},
							},
							cancel: {
								label: "Não",
								onClick: () => {
									toast.success("Ação cancelada!");
								},
							},
						});
					}}
					size="sm"
					isIconOnly
					color="danger"
					variant="flat"
				>
					<Trash size={15} />
				</Button>
			</Tooltip>
			<Tooltip content="Baixar" color="secondary">
				<Button
					onClick={async () => {
						const res = await downloadCourse_C({ id });
						const url = window.URL.createObjectURL(res.data);
						const a = document.createElement("a");
						a.href = url;
						a.download = `${name.replaceAll(" ", "-").toLowerCase()}.pdf`;
						document.body.appendChild(a);
						a.click();
						window.URL.revokeObjectURL(url);
						toast.info("Download iniciado!");
					}}
					size="sm"
					isIconOnly
					color="secondary"
					variant="flat"
				>
					<Download size={15} />
				</Button>
			</Tooltip>
			<Tooltip content="Visualizar" color="success">
				<Button
					size="sm"
					onClick={() => {
						window.open(`/${id}`, "_blank");
					}}
					isIconOnly
					color="secondary"
					variant="flat"
				>
					<BookOpen size={15} />
				</Button>
			</Tooltip>
		</div>
	);
};

export default ActionsColumn;
