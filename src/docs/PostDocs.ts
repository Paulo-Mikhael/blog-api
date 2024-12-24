import z from "zod";
import type { Schema } from "../types/Schema";
import { http } from "./schemas/http";
import { queryTakeSkipSchema } from "./schemas/queryTakeSkipSchema";
import { infoMessageSchema } from "./schemas/infoMessageSchema";
import { PostService } from "../services/PostService";
import { jsonWebTokenErrorSchema } from "./schemas/jsonWebTokenErrorSchema";
import { postReturnSchema } from "./components/postReturnSchema";
import { clientErrorSchema } from "./schemas/clientErrorSchema";
import { validationErrorSchema } from "./schemas/validationErrorSchema";
import { noContentSchema } from "./schemas/noContentSchema";

export class PostDocs {
  private postTag = "Post";
  private postService = new PostService();
  private postSchema = this.postService.postSchemaDocs;

  getAllSchema(): Schema {
    const newSchema: Schema = {
      summary: "Lista todos os posts",
      description:
        "Retorna uma lista com todos os posts cadastrados no sistema.",
      tags: [this.postTag],
      querystring: queryTakeSkipSchema,
      response: {
        200: http.code200Schema(
          z.object({
            posts: postReturnSchema.array(),
          })
        ),
        500: http.code500Schema(infoMessageSchema),
      },
      security: [],
    };

    return newSchema;
  }
  getByIdSchema(): Schema {
    const newSchema: Schema = {
      summary: "Retorna um post pelo id",
      tags: [this.postTag],
      response: {
        200: http.code200Schema(
          z.object({
            post: postReturnSchema,
          })
        ),
        404: http.code404Schema(clientErrorSchema),
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
        400: http.validationErrorSchema(validationErrorSchema),
        401: http.code401Schema(jsonWebTokenErrorSchema),
        406: http.clientErrorSchema(clientErrorSchema),
        500: http.code500Schema(infoMessageSchema),
      },
      body: this.postSchema,
    };

    return newSchema;
  }
  updateSchema(): Schema {
    const newSchema: Schema = {
      summary: "Atualiza um post do usuário atual",
      description: "Verifica o Bearer Token do usuário e cria um post.",
      tags: [this.postTag],
      params: z.object({
        id: z.string(),
      }),
      response: {
        204: http.code204Schema(noContentSchema),
        400: http.validationErrorSchema(validationErrorSchema),
        401: http.code401Schema(jsonWebTokenErrorSchema),
        404: http.code404Schema(clientErrorSchema),
        406: http.clientErrorSchema(clientErrorSchema),
        500: http.code500Schema(infoMessageSchema),
      },
      body: this.postSchema,
    };

    return newSchema;
  }
}
