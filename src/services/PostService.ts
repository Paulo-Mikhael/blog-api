import z from "zod";
import type { Post } from "../types/Post";

const message = "Propriedade nula ou inválida";
const minLengthMessage = "A propriedade deve ter pelo menos 1 caractere";
const maxLengthMessage = "A propriedade deve ter menos que 30 caracteres";

export class PostService {
  validate(body: unknown): Post {
    const postSchema = z.object({
      title: z
        .string({ message })
        .min(1, { message: minLengthMessage })
        .max(20, { message: maxLengthMessage }),
      content: z.string({ message }).min(1, { message: minLengthMessage }),
      category: z.string({ message }).min(1, { message: minLengthMessage }),
      authorId: z.number({ message }),
    });

    const validPost = postSchema.parse(body);

    const newPost: Post = {
      ...validPost,
      authorId: validPost.authorId,
      cover: "",
      slug: validPost.title.toLowerCase().replace(" ", "-"),
    };

    return newPost;
  }

  validateParamId(params: unknown): number {
    const idParamsSchema = z.object({ id: z.string() });
    const numberSchema = z.number({
      message: "O ID de um post deve ser um número",
    });

    const validatedParams = idParamsSchema.parse(params);
    const numberId = numberSchema.parse(Number(validatedParams.id));

    return Number(numberId);
  }
}
