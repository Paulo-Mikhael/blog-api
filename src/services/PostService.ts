import type { RequiredPropertiesObject } from "../types/RequiredPropertiesObject";
import z from "zod";
import { RequestService } from "./RequestService";

interface ValidatePostReturn {
  title: string;
  content: string;
  category: string;
  slug: string;
}

export class PostService extends RequestService {
  public readonly postSchemaDocs: RequiredPropertiesObject = {
    properties: {
      title: {
        type: "string",
        minLength: 1,
        maxLength: 100,
        description: "Título do post",
      },
      content: {
        type: "string",
        minimum: 1,
        description: "Conteúdo do post em formato markdown",
      },
      category: {
        type: "string",
        minLength: 1,
        description: "Categoria do post",
      },
    },
    requiredProperties: ["title", "content", "category"],
  };
  private postSchema = z.object({
    title: z
      .string({ message: this.requiredMessage })
      .min(1, { message: this.minLengthMessage() })
      .max(100, { message: this.maxLengthMessage(100) }),
    content: z
      .string({ message: this.requiredMessage })
      .min(1, { message: this.minLengthMessage() }),
    category: z
      .string({ message: this.requiredMessage })
      .min(1, { message: this.minLengthMessage() }),
  });

  validate(body: unknown): ValidatePostReturn {
    let objectBody = {};
    if (body && typeof body === "object") {
      objectBody = body;
    }
    const validPost = this.postSchema.parse(objectBody);

    return {
      ...validPost,
      category: this.normalizeText(validPost.category),
      slug: this.getSlug(validPost.title),
    };
  }

  getSlug(title: string): string {
    const normalizedTitle = this.normalizeText(title);
    return normalizedTitle
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // Remove caracteres não alfanuméricos exceto espaços e hifens
      .replace(/\s+/g, "-") // Substitui espaços por hifens
      .replace(/-+/g, "-"); // Remove hifens consecutivos
  }
}
