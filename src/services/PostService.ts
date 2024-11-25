import z from "zod";
import type { CreatePost } from "../types/CreatePost";
import { RequestService } from "./RequestService";

const message = "Propriedade inválida";
const minLengthMessage = "A propriedade deve ter pelo menos 1 caractere";
const maxLengthMessage = "A propriedade deve ter menos que 100 caracteres";

interface ValidatePostReturn {
  title: string;
  content: string;
  category: string;
  authorId: string;
  cover?: string;
}

export class PostService extends RequestService {
  validate(body: unknown): ValidatePostReturn {
    const postSchema = z.object({
      title: z
        .string({ message })
        .min(1, { message: minLengthMessage })
        .max(100, { message: maxLengthMessage }),
      content: z.string({ message }).min(1, { message: minLengthMessage }),
      category: z.string({ message }).min(1, { message: minLengthMessage }),
      authorId: z.string({ message }),
      cover: z.string().optional(),
    });

    const validPost = postSchema.parse(body);

    return validPost;
  }

  getSlug(title: string) {
    return title.toLowerCase().replaceAll(" ", "-");
  }
}
