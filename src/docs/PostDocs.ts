import { http } from "./schemas/http";
import { Docs, type RoutesDocs } from "../models/Docs";
import type { PathItemObject } from "../types/PathItemObject";
import { requestBody } from "./schemas/requestBody";

export class PostDocs extends Docs {
  private postTag = "Post";
  public routesDocs: RoutesDocs = [
    {
      path: "/posts",
      routeDocsArray: [this.getAllSchema(), this.createSchema()],
    },
    {
      path: "/posts/{id}",
      routeDocsArray: [
        this.getByIdSchema(),
        this.updateSchema(),
        this.deleteSchema(),
      ],
    },
    {
      path: "/post-cover/{id}",
      routeDocsArray: [this.updateCoverSchema()],
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
            $ref: "#/components/parameters/QueryTake",
          },
          {
            $ref: "#/components/parameters/QuerySkip",
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
        parameters: [
          {
            $ref: "#/components/parameters/ParameterId",
          },
        ],
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
          400: http.validationErrorSchema,
          401: http.tokenJWTErrorSchema,
          406: http.clientErrorSchema,
          500: http.code500Schema,
        },
        requestBody: requestBody.createPost,
      },
    };

    return newSchema;
  }
  updateSchema() {
    const newSchema: PathItemObject = {
      put: {
        summary: "Atualiza um post do usuário atual",
        description:
          "Verifica o Bearer Token do usuário e atualiza um post pertecente à ele.",
        tags: [this.postTag],
        parameters: [
          {
            $ref: "#/components/parameters/ParameterId",
          },
        ],
        responses: {
          204: http.code204Schema,
          400: http.validationErrorSchema,
          401: http.tokenJWTErrorSchema,
          404: http.code404Schema,
          406: http.clientErrorSchema,
          500: http.code500Schema,
        },
        requestBody: requestBody.createPost,
      },
    };

    return newSchema;
  }
  deleteSchema() {
    const newSchema: PathItemObject = {
      delete: {
        summary: "Deleta um post do usuário atual",
        description:
          "Verifica o Bearer Token do usuário e deleta um post pertecente à ele.",
        tags: [this.postTag],
        parameters: [
          {
            $ref: "#/components/parameters/ParameterId",
          },
        ],
        responses: {
          204: http.code204Schema,
          401: http.tokenJWTErrorSchema,
          404: http.code404Schema,
          406: http.clientErrorSchema,
          500: http.code500Schema,
        },
      },
    };

    return newSchema;
  }
  updateCoverSchema() {
    const newSchema: PathItemObject = {
      put: {
        summary: "Atualiza a capa de um post do usuário atual",
        description:
          "Verifica o Bearer Token do usuário e atualiza a capa de um post pertecente à ele.",
        tags: [this.postTag],
        parameters: [
          {
            $ref: "#/components/parameters/ParameterId",
          },
        ],
        responses: {
          204: http.code204Schema,
          401: http.tokenJWTErrorSchema,
          404: http.code404Schema,
          500: http.code500Schema,
        },
        requestBody: requestBody.updatePostCover,
      },
    };

    return newSchema;
  }
}
