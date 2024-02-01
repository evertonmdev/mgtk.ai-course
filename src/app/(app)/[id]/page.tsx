import { getCourse } from '@/services/backend/get-course';
import * as React from 'react';
import './teste.css'

interface IProps {
    params: {
        id: string;
    };
}

const App: React.FunctionComponent<IProps> = async ({ params: { id } }) => {
    const course = await getCourse({ id });

    const pureText = course?.etapas.map((etapa) => etapa.texto).join("<br>") || ""

    return (
        // biome-ignore lint/security/noDangerouslySetInnerHtmlWithChildren: <explanation>
        // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
        <div dangerouslySetInnerHTML={{ __html: pureText }} className='prose w-full h-full bg-background p-10 !text-foreground'>

        </div>
    );
};

export default App;
