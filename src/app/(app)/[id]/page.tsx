import { getCourse } from '@/services/backend/get-course';
import * as cheerio from 'cheerio';
import { Code } from 'lucide-react';
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
        let ultimo_html = ""

        if (html !== null) {
            const $ = cheerio.load(html)
            $('*').each((i, el) => {
                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                const tag = (el as any)?.name
                if (tag.trim() === "body" || tag.trim() === "html" || tag.trim() === "head") return
                const content = $(el).html()
                const text = $(el).text()

                if (ultimo_html.includes(`<${tag}>${content}</${tag}>`)) return
                ultimo_html = ""
                switch (tag) {
                    case "p":
                        ultimo_html = `<${tag}>${content}</${tag}>`
                        // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
                        renders.push(<p key={i} dangerouslySetInnerHTML={{ __html: content as string }} />)
                        break

                    case "pre":
                        ultimo_html = `<${tag}>${content}</${tag}>`
                        renders.push(
                            // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
                            <pre key={i} dangerouslySetInnerHTML={{ __html: content?.trim() as string }} />
                        )
                        break
                    case "codigo": {
                        ultimo_html = `<${tag}>${content}</${tag}>`
                        renders.push(
                            <pre key={i}>
                                <code>
                                    {content?.trim()}
                                </code>
                            </pre>
                        )
                        break
                    }
                    case "comando":
                        ultimo_html = `<${tag}>${content}</${tag}>`
                        renders.push(
                            <Code>
                                {text}
                            </Code>
                        )
                        break
                    case "ul": {
                        ultimo_html = `<${tag}>${content}</${tag}>`
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
                        ultimo_html = `<${tag}>${content}</${tag}>`
                        const list_contents: string[] = []
                        $(el).find("li").map((_i, el) => list_contents.push($(el).html() as string))
                        renders.push(
                            <ol key={i}>
                                {list_contents.map((content, i) => (
                                    <li
                                        key={`${i}_${content}`}
                                        // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
                                        dangerouslySetInnerHTML={{
                                            __html: content as string,
                                        }}
                                    />
                                ))}
                            </ol>
                        )
                        break
                    }
                    case "h1":
                    case "h2":
                    case "h3":
                    case "h4":
                    case "h5":
                    case "h6":
                        ultimo_html = `<${tag}>${content}</${tag}>`
                        renders.push(
                            React.createElement(tag, { key: i, className: 'text-red-500 dark:text-violet-600' }, text)
                        );
                        break
                    case "li":
                    case "b":
                        ultimo_html = `<${tag}>${content}</${tag}>`
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
