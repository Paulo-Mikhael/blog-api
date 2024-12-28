import { http } from "./schemas/http";
import { Docs, type RouteDocs } from "../models/Docs";
import type { PathItemObject } from "../types/PathItemObject";

export class PostDocs extends Docs {
  private postTag = "Post";
  public routesDocs: RouteDocs = [
    {
      path: "/posts",
      routeDocs: [this.getAllSchema(), this.createSchema()],
    },
    {
      path: "/post/:id",
      routeDocs: [this.getByIdSchema()],
    },
  ];

  getAllSchema() {
    const newSchema: PathItemObject = {
      get: {
        summary: "Retorna todos os posts",
        description:
          "Retorna uma lista com todos os posts cadastrados no sistema. Qualquer usuário pode acessar.",
        tags: [this.postTag],
        responses: {
          200: http.code200Schema({
            posts: {
              type: "array",
              items: { $ref: "#/components/schemas/Post" },
            },
          }),
          500: http.code500Schema,
        },
        parameters: [
          {
            $ref: "#/components/parameters/TakeQuery",
          },
          {
            $ref: "#/components/parameters/SkipQuery",
          },
        ],
        security: [],
      },
    };

    return newSchema;
  }
  getByIdSchema() {
    const newSchema: PathItemObject = {
      get: {
        summary: "Retorna um post pelo id",
        tags: [this.postTag],
        responses: {
          200: http.code200Schema({
            post: {
              $ref: "#/components/schemas/Post",
            },
          }),
          404: http.code404Schema,
          500: http.code500Schema,
        },
        security: [],
      },
    };

    return newSchema;
  }
  createSchema() {
    const newSchema: PathItemObject = {
      post: {
        summary: "Cria um post para o usuário atual",
        description: "Verifica o Bearer Token do usuário e cria um post.",
        tags: [this.postTag],
        responses: {
          201: http.code201Schema({
            postId: {
              type: "string",
              format: "uuid",
            },
          }),
          // 400: http.validationErrorSchema,
          // 401: http.code401Schema,
          // 406: http.clientErrorSchema,
          500: http.code500Schema,
        },
        // body: this.postSchema,
      },
    };

    return newSchema;
  }
  updateSchema() {
    const newSchema = {
      summary: "Atualiza um post do usuário atual",
      description:
        "Verifica o Bearer Token do usuário e atualiza um post pertecente à ele.",
      tags: [this.postTag],
      // params: paramIdSchema,
      response: {
        // 204: http.code204Schema,
        // 400: http.validationErrorSchema,
        // 401: http.code401Schema,
        // 404: http.code404Schema,
        // 406: http.clientErrorSchema,
        // 500: http.code500Schema,
      },
      // body: this.postSchema,
    };

    return newSchema;
  }
  deleteSchema() {
    const newSchema = {
      summary: "Deleta um post do usuário atual",
      description:
        "Verifica o Bearer Token do usuário e deleta um post pertecente à ele.",
      tags: [this.postTag],
      // params: paramIdSchema,
      response: {
        // 204: http.code204Schema,
        // 401: http.code401Schema,
        // 404: http.code404Schema,
        // 406: http.clientErrorSchema,
        // 500: http.code500Schema,
      },
    };

    return newSchema;
  }
  updateCoverSchema() {
    const newSchema = {
      summary: "Atualiza a capa de um post do usuário atual",
      description:
        "Verifica o Bearer Token do usuário e atualiza a capa de um post pertecente à ele.",
      tags: [this.postTag],
      response: {
        // 204: http.code204Schema,
        // 401: http.code401Schema,
        // 404: http.code404Schema,
        // 500: http.code500Schema,
      },
      consumes: ["multipart/form-data"],
      body: {
        type: "object",
        properties: {
          file: {
            type: "string",
            format: "binary", // Necessário para indicar upload de arquivo no Swagger
            description: "Imagem para upload",
          },
        },
        required: ["file"],
      },
    };

    return newSchema;
  }
}
