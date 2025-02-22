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
        this.updateSchema(),
        this.deleteSchema(),
        this.getByIdSchema(),
      ],
    },
    {
      path: "/post-cover/{id}",
      routeDocsArray: [this.updateCoverSchema()],
    },
    {
      path: "/posts/user/{name}",
      routeDocsArray: [this.getByAuthorNameSchema()],
    },
    {
      path: "/posts/category/{category}",
      routeDocsArray: [this.getByCategorySchema()],
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
        description: "Retorna um post pelo id. Qualquer usuário pode acessar",
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
  getByCategorySchema() {
    const newSchema: PathItemObject = {
      get: {
        summary: "Retorna uma lista de posts pela categoria",
        description:
          "Retorna uma lista de posts pela categoria. Qualquer usuário pode acessar",
        tags: [this.postTag],
        parameters: [
          {
            name: "category",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
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
  getByAuthorNameSchema() {
    const newSchema: PathItemObject = {
      get: {
        summary: "Retorna uma lista de posts pelo nome do author",
        description:
          "Retorna uma lista de posts pelo nome do autor. Qualquer usuário pode acessar.",
        tags: [this.postTag],
        parameters: [
          {
            $ref: "#/components/parameters/ParameterName",
          },
          {
            $ref: "#/components/parameters/QueryTake",
          },
          {
            $ref: "#/components/parameters/QuerySkip",
          },
        ],
        responses: {
          200: http.code200Schema({
            post: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Post",
              },
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
          406: http.clientErrorSchema(
            "Perfil inexistente",
            "O usuário precisa ter um perfil para criar posts"
          ),
          500: http.code500Schema,
        },
        requestBody: requestBody.createPost,
        security: [{ BearerAuth: [] }],
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
          406: http.clientErrorSchema(
            "Perfil inexistente",
            "O usuário atual não possui um perfil."
          ),
          500: http.code500Schema,
        },
        requestBody: requestBody.createPost,
        security: [{ BearerAuth: [] }],
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
          500: http.code500Schema,
        },
        security: [{ BearerAuth: [] }],
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
          200: http.code200Schema({
            imageUrl: {
              type: "string",
              format: "url",
            },
          }),
          400: http.clientErrorSchema(
            "Requisição inválida",
            "Requisição inválida. Precisa-se ser do tipo 'multipart/form-data'"
          ),
          401: http.tokenJWTErrorSchema,
          404: http.code404Schema,
          413: http.clientErrorSchema(
            "Arquivo maior que 1,7mb",
            "Tamanho máximo de arquivo excedido"
          ),
          415: http.clientErrorSchema(
            "Arquivo inválido",
            "Insira um arquivo de imagem"
          ),
          500: http.code500Schema,
        },
        requestBody: requestBody.updatePostCover,
        security: [{ BearerAuth: [] }],
      },
    };

    return newSchema;
  }
}
