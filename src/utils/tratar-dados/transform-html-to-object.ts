export const transformHtmlToObject = (html: string) => {
    const tagsConteudos = html.match(/<([^>]+)>(.*?)<\/\1>/g);

    const resultado = tagsConteudos?.map(tag => {
        const partes = tag.match(/<([^>]+)>(.*?)<\/\1>/);
        return {
            tag: partes?.[1],
            conteudo: partes?.[0].replace(`</${partes?.[1]}>`, '').replace(`<${partes?.[1]}>`, '')
        }
    });

    return resultado
}