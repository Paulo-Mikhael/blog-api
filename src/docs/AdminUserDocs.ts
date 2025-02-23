import type { PathItemObject } from "../types/PathItemObject";
import { Docs, type RoutesDocs } from "../models/Docs";
import { http } from "./schemas/http";
import { requestBody } from "./schemas/requestBody";

export class AdminUserDocs extends Docs {
  private adminTag = "Admin";
  public routesDocs: RoutesDocs = [
    {
      path: "/admin/users",
      routeDocsArray: [this.getAllSchema(), this.createSchema()],
    },
    {
      path: "/admin/users/{id}",
      routeDocsArray: [
        this.deleteSchema(),
        this.updateSchema(),
        this.getByIdSchema(),
      ],
    },
  ];

  getAllSchema(): PathItemObject {
    const newSchema: PathItemObject = {
      get: {
        summary: "Lista todos os usuários",
        description:
          "Retorna uma lista de todos os usuários cadastrados no sistema.",
        tags: [this.adminTag],
        responses: {
          200: http.code200Schema({
            users: {
              type: "array",
              items: {
                $ref: "#/components/schemas/User",
              },
            },
          }),
          401: http.adminAcess401Error,
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
      },
    };

    return newSchema;
  }
  getByIdSchema(): PathItemObject {
    const newSchema: PathItemObject = {
      get: {
        summary: "Retorna um usuário pelo id",
        tags: [this.adminTag],
        parameters: [
          {
            $ref: "#/components/parameters/ParameterId",
          },
        ],
        responses: {
          200: http.code200Schema({
            user: {
              $ref: "#/components/schemas/User",
            },
          }),
          401: http.adminAcess401Error,
          404: http.code404Schema,
          500: http.code500Schema,
        },
      },
    };

    return newSchema;
  }
  createSchema(): PathItemObject {
    const newSchema: PathItemObject = {
      post: {
        summary: "Cadastra um usuário",
        description: "Cria um novo usuário e retorna um Json Web Token.",
        tags: [this.adminTag],
        responses: {
          201: http.code200Schema({
            jwtToken: {
              type: "string",
            },
          }),
          400: http.validationErrorSchema,
          401: http.adminAcess401Error,
          406: http.clientErrorSchema(
            "Senha fraca",
            "A senha precisa ter pelo menos 8 caracteres."
          ),
          409: http.clientErrorSchema(
            "Conflito com o banco de dados",
            "Usuário já existente"
          ),
          500: http.code500Schema,
        },
        requestBody: requestBody.createUser,
      },
    };

    return newSchema;
  }
  deleteSchema(): PathItemObject {
    const newSchema: PathItemObject = {
      delete: {
        summary: "Deleta um usuário pelo id",
        description: "Deleta o usuário de id informado.",
        tags: [this.adminTag],
        parameters: [
          {
            $ref: "#/components/parameters/ParameterId",
          },
        ],
        responses: {
          204: http.code204Schema,
          401: http.adminAcess401Error,
          500: http.code500Schema,
        },
      },
    };

    return newSchema;
  }
  updateSchema(): PathItemObject {
    const newSchema: PathItemObject = {
      put: {
        summary: "Atualiza os dados de um usuário pelo id",
        description: "Atualiza os dados do usuário de id informado.",
        tags: [this.adminTag],
        parameters: [
          {
            $ref: "#/components/parameters/ParameterId",
          },
        ],
        responses: {
          204: http.code204Schema,
          401: http.adminAcess401Error,
          406: http.clientErrorSchema(
            "Senha fraca",
            "A senha precisa ter pelo menos 8 caracteres"
          ),
          409: http.clientErrorSchema(
            "Conflito com o banco de dados",
            "O e-mail fornecido já está em uso"
          ),
          500: http.code500Schema,
        },
        requestBody: requestBody.updateUser,
      },
    };

    return newSchema;
  }
}
