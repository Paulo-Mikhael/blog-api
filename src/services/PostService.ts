import z from "zod";

interface CreatePostProps {
  title: string;
  content: string;
  category: string;
  authorId: string;
}

const message = "A propriedade é obrigatória";
const minLengthMessage = "A propriedade deve ter pelo menos 1 caractere";
const maxLengthMessage = "A propriedade deve ter menos que 30 caracteres";
const postSchema = z.object({
  title: z
    .string({ message })
    .min(1, { message: minLengthMessage })
    .max(20, { message: maxLengthMessage }),
  content: z.string({ message }).min(1, { message: minLengthMessage }),
  category: z.string({ message }).min(1, { message: minLengthMessage }),
  authorId: z.string({ message }).min(1, { message: minLengthMessage }),
});

export class PostService {
  validate(body: unknown) {
    return postSchema.parse(body);
  }
  async create(post: CreatePostProps) {
    return post;
  }
}
