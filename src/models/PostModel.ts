import z from "zod";

const message = "A propriedade é obrigatória";
const minLengthMessage = "A propriedade deve ter pelo menos 1 caractere";
const maxLengthMessage = "A propriedade deve ter menos que 30 caracteres";

export class PostModel {
  postSchema = z.object({
    title: z
      .string({ message })
      .min(1, { message: minLengthMessage })
      .max(20, { message: maxLengthMessage }),
    content: z.string({ message }).min(1, { message: minLengthMessage }),
    category: z.string({ message }).min(1, { message: minLengthMessage }),
    authorId: z.string({ message }).min(1, { message: minLengthMessage }),
  });

  validate(body: unknown) {
    return this.postSchema.parse(body);
  }
}
