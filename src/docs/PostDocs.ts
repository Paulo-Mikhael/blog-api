import z from "zod";
import type { Schema } from "../types/Schema";
import { http } from "./schemas/http";
import { queryTakeSkipSchema } from "./schemas/queryTakeSkipSchema";
import { infoMessageSchema } from "./schemas/infoMessageSchema";
import { PostService } from "../services/PostService";
import { jsonWebTokenErrorSchema } from "./schemas/jsonWebTokenErrorSchema";

export class PostDocs {
  private postTag = "Post";
  private postService = new PostService();
  private postSchema = this.postService.postSchemaDocs;

  getAllSchema(): Schema {
    const newSchema: Schema = {
      summary: "Lista todos os posts",
      description: "Retorna uma lista com todos os posts.",
      tags: [this.postTag],
      querystring: queryTakeSkipSchema,
      response: {
        500: http.code500Schema(infoMessageSchema),
      },
      security: [],
    };

    return newSchema;
  }
  createSchema(): Schema {
    const newSchema: Schema = {
      summary: "Cria um post para o usuário atual",
      description: "Verifica o Bearer Token do usuário e cria um post.",
      tags: [this.postTag],
      response: {
        201: http.code201Schema(
          z.object({
            postId: z.string().describe("Id do post criado"),
          })
        ),
        401: http.code401Schema(jsonWebTokenErrorSchema),
        500: http.code500Schema(infoMessageSchema),
      },
      body: this.postSchema,
      security: [],
    };

    return newSchema;
  }
}
