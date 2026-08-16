# API para blogs [Node 24]
![página principal da aplicação](public/images/blog-api-image.png)

## Sobre ✏️
### Uma api para aplicações que precisam gerenciar usuários e posts, possui um sistema completo de cadastro, onde é possível gerenciar o usuário atual por meio de token JWT, fazer login e encerrar sessão. A api foi contruída, de modo que, cada usuário acesse apenas o perfil dos demais, para toda vez que houver um acesso, não ocorrer o tráfego de informações sensíveis que não estão no perfil, como a senha.

## Tecnologias 💻
<div>
  <abbr title="Node.js - Ambiente de executação de javascript">
    <img src="https://img.shields.io/badge/Node.js-5FA04E.svg?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Badge do Node" />
  </abbr>
  <abbr title="Typescript - Linguagem fortemente tipada">
    <img src="https://img.shields.io/badge/TypeScript-3178C6.svg?style=for-the-badge&logo=TypeScript&logoColor=white" alt="Badge do Typescript" />
  </abbr>
  <abbr title="Fastify - Framework web para node.js">
    <img src="https://img.shields.io/badge/Fastify-000000.svg?style=for-the-badge&logo=Fastify&logoColor=white" alt="Badge do Fastify" />
  </abbr>
  <abbr title="Prisma - Object-Relational Mapping para node.js">
    <img src="https://img.shields.io/badge/Prisma-2D3748.svg?style=for-the-badge&logo=Prisma&logoColor=white" alt="Badge do Prisma" />
  </abbr>
  <abbr title="Json Web Tokens - Tokens para autenticação de usuários">
    <img src="https://img.shields.io/badge/JSON%20Web%20Tokens-000000.svg?style=for-the-badge&logo=JSON-Web-Tokens&logoColor=white" alt="Badge do token JWT" />
  </abbr>
</div>

## Bibliotecas 📚
<div>
  <abbr title="Zod - Biblioteca de validação de dados">
    <img src="https://img.shields.io/badge/Zod-3E67B1.svg?style=for-the-badge&logo=Zod&logoColor=white" alt="Badge da biblioteca Zod" />
  </abbr>
</div>

## Estrutura principal do Projeto 🗃️
```plaintext
prisma
├── migrations/
│   └── ...
├── schema.prisma
└── seed.ts
src
├── controllers/
│   └── ...
├── data/
│   └── ...
├── db/
│   └── ...
├── docs/
│   ├── schemas/
│   │   └── ...
│   └── ...
├── errors/
│   └── ...
├── models/
│   └── ...
├── routes/
│   └── ...
├── services/
│   └── ...
├── types/
│   └── ...
├── utils/
│   └── ...
├── routes.ts
└── server.ts
uploads
└── ...
```
### Descrição:
- prisma - Configuração do Prisma ORM.
  - migrations - Contém os arquivos de migração do banco de dados.
  - schema.prisma - Define o esquema do banco de dados, incluindo modelos e conexões.
  - seed.ts - Script para inserir dados iniciais no banco.

- src - Contém o código principal do servidor.
  - controllers - Controladores que lidam com as requisições HTTP.
  - data - Armazena dados estáticos ou mocks.
  - db - Configuração de conexão com o banco de dados.
  - docs - Armazena documentação, como arquivos Swagger/OpenAPI.
  - errors - Define classes de erro e tratamento de exceções personalizadas.
  - models - Define os modelos da aplicação, possivelmente integrados ao Prisma.
  - routes - Contém a definição das rotas da API.
  - services - Lógica de negócios, como funções auxiliares para os controladores.
  - types - Define tipos e interfaces para uso no TypeScript.
  - utils - Funções utilitárias genéricas.
  - routes.ts - Arquivo que configura e registra as rotas da API.
  - server.ts - Inicia o servidor, possivelmente com Express ou Fastify.

- uploads - Diretório usado para armazenar arquivos enviados via upload.


## Design Pattern
### No projeto está sendo utilizado o padrão [MVC](https://developer.mozilla.org/en-US/docs/Glossary/MVC), onde é definido um modelo de organização de arquivos para melhor manutenção e legibilidade do código. A pasta Model guarda os arquivos responsáveis por definir como devem ser a estrutura dos dados, a pata Service guarda as funções que recebem e validam os dados, e a pasta controllers armazena toda a lógica que acontece ao acessar uma rota.

## Rodando Localmente (Prompt) 📟
### Caso não tenha, instale o [docker desktop](https://www.docker.com/products/docker-desktop/), e deixe-o aberto/segundo plano (importante)
### Clone o projeto
```bash
  git clone https://github.com/Paulo-Mikhael/blog-api
```
### Entre no diretório do projeto
```bash
  cd blog-api
```
### Instale as dependências
```bash
  npm install
```
### Execute o container docker
```bash
  docker compose up
```
### Aplique as migrations do prisma
```bash
  npx prisma migrate dev
```
### Insira alguns dados iniciais (opcional)
```bash
  npx prisma db seed
```
### Crie um arquivo .env e insira as seguintes informações
```bash
DATABASE_URL="postgresql://docker:docker@localhost:5560/blog-database"; # String de conexão com o banco de dados local
JWT_SECRET="kdnoivgasfoivnioasvuoduivuiasnvfuiasfnhis2j39hrf9832h8fhwneofh"; # Chave secreta aleatória para assinatura de tokens JWT
# Variáveis de ambiente obrigatórias apenas para envio de emails (opcional)
MAILERSENDDOMAIN="Dominio da MailerSend"; # Domínio da MailerSend para envio de emails
API_KEY="ChaveAPI da MailerSend"; # Chave da API da MailerSend para envio de emails
```
### Inicie o servidor
```bash
  npm run dev
```
#### Os passos abaixo são obrigatórios apenas para a funcionalidade de enviar emails
### Crie uma conta na [MailerSend](https://www.mailersend.com/)
### Na tela [Domains](https://app.mailersend.com/domains), terá um domínio gratis para testes
### Acesse "Developer tools", e [API tokens](https://app.mailersend.com/api-tokens), e gere uma chave de API
### Adicione o domínio e a chave de API no arquivo .env
```bash
# ...
MAILERSENDDOMAIN="Dominio da MailerSend"; # Domínio da MailerSend para envio de emails
API_KEY="ChaveAPI da MailerSend"; # Chave da API da MailerSend para envio de emails
```

## Talvez você queira ver 💡
  ### [Portifólio](https://portifolio-react-three.vercel.app/)
  ### [Currículo](https://docs.google.com/document/d/1xhimUtV6EM7c1GtwBwAHsIonX1HjoLSi/edit)

## Confira meus outros projetos 🛠️
  - [Barbershop - Plataforma de agendamento](http://github.com/Paulo-Mikhael/blog-api?tab=readme-ov-file)
  - [Landing Page para uma plataforma de venda de ingressos](https://github.com/Paulo-Mikhael/cinema-lp?tab=readme-ov-file#readme)
  - [XWritter - Aplicação para compartilhar posts](https://github.com/Paulo-Mikhael/xwriter?tab=readme-ov-file#readme)

## Contatos 📞
  [![Gmail Badge](https://img.shields.io/badge/Gmail-EA4335.svg?style=for-the-badge&logo=Gmail&logoColor=white)](https://portifolio-react-three.vercel.app/contacts)
  [![Linkedin Badge](https://img.shields.io/badge/LinkedIn-0A66C2.svg?style=for-the-badge&logo=LinkedIn&logoColor=white)](https://www.linkedin.com/in/paulo-miguel-bentes-do-nascimento-4b706022b/)
  [![Instagram Badge](https://img.shields.io/badge/Instagram-E4405F.svg?style=for-the-badge&logo=Instagram&logoColor=white)](https://www.instagram.com/pa__miguel?igsh=MWxoYzdqNGluZWcyaA%3D%3D)
  [![Whatsapp Badge](https://img.shields.io/badge/WhatsApp-25D366.svg?style=for-the-badge&logo=WhatsApp&logoColor=white)](https://api.whatsapp.com/send/?phone=5592992813253&type=phone_number&app_absent=0)