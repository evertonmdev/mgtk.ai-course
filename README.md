*⚠️ A plataforma exige um tempo mínimo de 1 minuto para o processamento do backend, o que excede o limite de resposta da Vercel. Portanto, para rodar este projeto com SQLite e server actions, é necessário clonar o repositório e executá-lo localmente. ⚠️*
# EBook Generator

## Como funciona
- O projeto é um gerador de ebooks, com o uso de nextjs, prisma, sqlite, bunjs e api da gemini do google essa aplicação é capaz de gerar cursos

## Instalação
- Para instalar o projeto basta clonar o repositório e rodar o comando `bun install` para instalar as dependencias
- em seguida rodar o comando `bun prisma generate` para gerar o prisma client
- logo após rode o comando `bun prisma migrate dev` para criar o banco de dados
- e por fim rodar o comando `bun run dev` para rodar o projeto 

## Como usar
- Logo após a instalação basta acessar o endereço `http://localhost:3000` para acessar a aplicação
- A aplicação é bem simples, basta inserir o tema do curso/ebook e clicar no botão gerar para criar um novo ebook
- O ebook será gerado em formato pdf e disponibilizado para download

obs: Se deseja gerar um curso em português, adicione essa condição no campos "Adicionais" do formulário

## Tecnologias
- Nextjs
- Prisma
- Sqlite
- Bunjs
- Google Gemini API


## Licença
- Esse projeto é open source e está sobre a licença do MIT
