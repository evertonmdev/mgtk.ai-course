import { Tooltip } from '@nextui-org/react';
import * as React from 'react';

interface IIdContentProps {
    id: string
}

const IdContent: React.FunctionComponent<IIdContentProps> = ({ id }) => {
    return <Tooltip content={id} className="rounded-md">
        <div className="max-w-[70px] overflow-hidden">
            {id}
        </div>
    </Tooltip>;
};

export default IdContent;
