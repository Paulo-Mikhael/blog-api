import z from "zod";
import type { Post } from "../types/Post";

const message = "Propriedade nula ou inválida";
const minLengthMessage = "A propriedade deve ter pelo menos 1 caractere";
const maxLengthMessage = "A propriedade deve ter menos que 30 caracteres";
const postSchema = z.object({
  title: z
    .string({ message })
    .min(1, { message: minLengthMessage })
    .max(20, { message: maxLengthMessage }),
  content: z.string({ message }).min(1, { message: minLengthMessage }),
  category: z.string({ message }).min(1, { message: minLengthMessage }),
  authorId: z.number({ message }),
});

export class PostService {
  validate(body: unknown): Post {
    const validPost = postSchema.parse(body);

    const newPost: Post = {
      ...validPost,
      authorId: validPost.authorId,
      cover: "",
      slug: validPost.title.toLowerCase().replace(" ", "-"),
    };

    return newPost;
  }
}
