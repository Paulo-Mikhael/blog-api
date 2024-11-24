import z from "zod";
import { v4 as uuidV4 } from "uuid";
import type { Post } from "../types/Post";
import { RequestService } from "./RequestService";

const message = "Propriedade inválida";
const minLengthMessage = "A propriedade deve ter pelo menos 1 caractere";
const maxLengthMessage = "A propriedade deve ter menos que 100 caracteres";

export class PostService extends RequestService {
  validate(body: unknown): Post {
    const postSchema = z.object({
      title: z
        .string({ message })
        .min(1, { message: minLengthMessage })
        .max(100, { message: maxLengthMessage }),
      content: z.string({ message }).min(1, { message: minLengthMessage }),
      category: z.string({ message }).min(1, { message: minLengthMessage }),
      authorId: z.string({ message }),
    });

    const validPost = postSchema.parse(body);

    const newPost: Post = {
      id: uuidV4(),
      ...validPost,
      authorId: validPost.authorId,
      cover: "",
      slug: validPost.title.toLowerCase().replaceAll(" ", "-"),
    };

    return newPost;
  }
}
