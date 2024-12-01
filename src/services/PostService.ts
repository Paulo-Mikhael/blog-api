import z from "zod";
import { RequestService } from "./RequestService";

interface ValidatePostReturn {
  title: string;
  content: string;
  category: string;
  authorId: string;
  slug: string;
  cover?: string;
}

export class PostService extends RequestService {
  validate(body: unknown): ValidatePostReturn {
    const postSchema = z.object({
      title: z
        .string({ message: this.requiredMessage })
        .min(1, { message: this.minLengthMessage })
        .max(100, { message: this.maxLengthMessage }),
      content: z
        .string({ message: this.requiredMessage })
        .min(1, { message: this.minLengthMessage }),
      category: z
        .string({ message: this.requiredMessage })
        .min(1, { message: this.minLengthMessage }),
      authorId: z.string({ message: this.requiredMessage }),
      cover: z.string().optional(),
    });

    const validPost = postSchema.parse(body);

    return {
      ...validPost,
      category: validPost.category.toLowerCase(),
      slug: this.getSlug(validPost.title),
    };
  }

  getSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize("NFD") // Remove acentos e caracteres especiais
      .replace(/[\u0300-\u036f]/g, "") // Remove marcas diacríticas
      .replace(/[^a-z0-9\s-]/g, "") // Remove caracteres não alfanuméricos exceto espaços e hifens
      .replace(/\s+/g, "-") // Substitui espaços por hifens
      .replace(/-+/g, "-") // Remove hifens consecutivos
      .trim(); // Remove espaços ou hifens extras no início e no fim
  }
}
