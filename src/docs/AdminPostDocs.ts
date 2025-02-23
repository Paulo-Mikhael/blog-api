import { CrudDocs } from "../models/CrudDocs";
import type { RoutesDocs } from "../models/Docs";
import type { PathItemObject } from "../types/PathItemObject";
import { http } from "./schemas/http";
import { requestBody } from "./schemas/requestBody";

export class AdminPostDocs extends CrudDocs {
  private adminTag = "Admin";
  public routesDocs: RoutesDocs = [
    {
      path: "/admin/posts/{id}",
      routeDocsArray: [
        this.createSchema(),
        this.deleteSchema(),
        this.updateSchema(),
      ],
    },
    {
      path: "/admin/post-cover/{id}",
      routeDocsArray: [this.updateCoverSchema()],
    },
  ];

  createSchema() {
    const newSchema: PathItemObject = {
      post: {
        summary: "Cria um post para um usuário pelo id",
        description: "Cria um post para o usuário de id informado.",
        tags: [this.adminTag],
        parameters: [
          {
            $ref: "#/components/parameters/ParameterId",
          },
        ],
        responses: {
          201: http.code201Schema({
            postId: {
              type: "string",
              format: "uuid",
            },
          }),
          400: http.validationErrorSchema,
          401: http.adminAcess401Error,
          406: http.clientErrorSchema(
            "Perfil inexistente",
            "O usuário precisa ter um perfil para criar posts"
          ),
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
        tags: [this.adminTag],
        parameters: [
          {
            $ref: "#/components/parameters/ParameterId",
          },
        ],
        responses: {
          204: http.code204Schema,
          400: http.validationErrorSchema,
          401: http.adminAcess401Error,
          404: http.code404Schema,
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
        tags: [this.adminTag],
        parameters: [
          {
            $ref: "#/components/parameters/ParameterId",
          },
        ],
        responses: {
          204: http.code204Schema,
          401: http.adminAcess401Error,
          404: http.code404Schema,
          500: http.code500Schema,
        },
      },
    };

    return newSchema;
  }
  updateCoverSchema() {
    const newSchema: PathItemObject = {
      put: {
        summary: "Atualiza a capa de um post do usuário pelo id",
        description: "Atualiza a capa de um post do usuário de id informado.",
        tags: [this.adminTag],
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
          401: http.adminAcess401Error,
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
      },
    };

    return newSchema;
  }
}
