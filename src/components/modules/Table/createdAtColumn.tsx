import { formatDate } from '@/lib/form-date';
import * as React from 'react';

interface ICreatAtColumnProps {
    data: Date;
}

const CreatAtColumn: React.FunctionComponent<ICreatAtColumnProps> = ({ data }) => {
    return (
        <span className="max-[100px]">
            {formatDate(data)}
        </span>
    );
};

export default CreatAtColumn;
