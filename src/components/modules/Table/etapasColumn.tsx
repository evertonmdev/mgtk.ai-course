import { getAllCoursesType } from '@/services/backend/get-all-courses';
import { Card, CardBody, Chip, Tooltip } from '@nextui-org/react';
import * as React from 'react';

interface IEtapasColumnProps {
    etapas: getAllCoursesType[0]['etapas']
}

const EtapasColumn: React.FunctionComponent<IEtapasColumnProps> = ({ etapas }) => {
    return (
        <Tooltip placement="left" className="cursor-default" closeDelay={0} content={<Card>
            <CardBody>
                {
                    etapas.map((etapa, i) => (
                        <p key={`${i}_${etapa.nome}`} className="text-xs">
                            {etapa.nome}
                        </p>
                    ))
                }
            </CardBody>
        </Card>}>
            <Chip className="max-[100px] text-xs cursor-default" variant="dot" color="success">
                {
                    etapas.length
                }
            </Chip>
        </Tooltip>
    );
};

export default EtapasColumn;
