import { Chip } from '@nextui-org/react';
import * as React from 'react';

interface IStatusColumnProps {
    status: string;
}

const StatusColumn: React.FunctionComponent<IStatusColumnProps> = ({ status }) => {
    return (
        <Chip variant="flat" className="select-none" color={
            status === "Sucesso!" ? "success" : status === "Aguardando" ? "warning" : "danger"
        }>
            {status}
        </Chip>
    );
};

export default StatusColumn;
