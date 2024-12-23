import z from "zod";

export const postReturnSchema = z
  .object({
    id: z.string().uuid().describe("Identificador único para o post."),
    slug: z.string().describe("Um identificador amigável para URL do post."),
    title: z.string().describe("O título do post."),
    cover: z.string().optional().describe("A URL da imagem de capa do post."),
    content: z
      .string()
      .describe("O conteúdo principal do post, em formato markdown."),
    category: z.string().describe("A categoria à qual o post pertence."),
    createdAt: z
      .string()
      .datetime()
      .describe("A data e hora de criação do post."),
    updatedAt: z
      .string()
      .datetime()
      .describe("A data e hora da última atualização do post."),
    authorId: z
      .string()
      .uuid()
      .describe("O identificador único do perfil de usuário autor do post."),
  })
  .describe("Informações do post disponíveis à todos os usuários.");
