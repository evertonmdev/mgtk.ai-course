import { getCourse } from '@/services/backend/get-course';
import * as cheerio from 'cheerio';
import * as React from 'react';
import './style.css';


interface IProps {
    params: {
        id: string;
    };
}

const App: React.FunctionComponent<IProps> = async ({ params: { id } }) => {
    const course = await getCourse({ id });

    if (course === null) return <div className='prose p-10'>
        <h1>Curso não encontrado</h1>
    </div>

    const renders: React.ReactNode[] = []

    for (const etapa of course.etapas) {

        const html = etapa.texto

        if (html !== null) {
            const $ = cheerio.load(html)
            $('*').each((i, el) => {
                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                const tag = (el as any)?.name
                if (tag.trim() === "body" || tag.trim() === "html" || tag.trim() === "head") return
                const content = $(el).html()
                const text = $(el).text()

                switch (tag) {
                    case "p":
                        // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
                        renders.push(<p key={i} dangerouslySetInnerHTML={{ __html: content as string }} />)
                        break
                    case "code":
                        renders.push(<code key={i} className='before:content-none after:content-none'>
                            <pre>
                                {content}
                            </pre>
                        </code>)
                        break
                    case "ul": {
                        const list_contents: string[] = []
                        $(el).find("li").map((_i, el) => list_contents.push($(el).html() as string))
                        renders.push(
                            <ul key={i}>
                                {/* biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */}
                                {list_contents.map((content, i) => <li dangerouslySetInnerHTML={{ __html: content }} key={`${i}_${content}`} />)}
                            </ul>
                        )
                        break
                    }
                    case "ol": {
                        const list_contents: string[] = []
                        $(el).find("li").map((_i, el) => list_contents.push($(el).text()))
                        renders.push(
                            <ol key={i}>
                                {list_contents.map((content, i) => <li key={`${i}_${content}`} >{content}</li>)}
                            </ol>
                        )
                        break
                    }
                    case "h1":
                        renders.push(<h1 key={i} className='text-red-500 dark:text-violet-600'>{text}</h1>)
                        break
                    case "h2":
                        renders.push(<h2 key={i} className='text-red-500 dark:text-violet-600'>{text}</h2>)
                        break
                    case "h3":
                        renders.push(<h3 key={i} className='text-red-500 dark:text-violet-600'>{text}</h3>)
                        break
                    case "h4":
                        renders.push(<h4 key={i} className='text-red-500 dark:text-violet-600'>{text}</h4>)
                        break
                    case "h5":
                        renders.push(<h5 key={i} className='text-red-500 dark:text-violet-600'>{text}</h5>)
                        break
                    case "h6":
                        renders.push(<h6 key={i} className='text-red-500 dark:text-violet-600'>{text}</h6>)
                        break
                    case "li":
                    case "b":
                        break
                    default: {
                        console.log({
                            tag,
                            content
                        })
                        // renders.push(<div dangerouslySetInnerHTML={{ __html: content as string }} />)
                    }


                }
            })
        }

    }

    return (
        <div className='prose w-full h-full bg-background p-10 !text-foreground'>
            {
                ...renders
            }
        </div>
    );
};

export default App;
