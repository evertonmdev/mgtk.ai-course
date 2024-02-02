import { IStackStatus } from '@/app/(backend)/api/start-stack/route';
import { Chip } from '@nextui-org/react';
import * as React from 'react';

interface IStatusColumnProps {
    status: IStackStatus;
}

const StatusColumn: React.FunctionComponent<IStatusColumnProps> = ({ status }) => {
    return (
        <Chip variant="flat" className="select-none max-w-[100px] overflow-hidden" color={
            status === "Sucesso!" ? "success" : status === "Falhou" ? "danger" : "warning"
        }>
            {status}
        </Chip>
    );
};

export default StatusColumn;
