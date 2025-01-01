import { http } from "./schemas/http";
import type { PathItemObject } from "../types/PathItemObject";
import { Docs, type RoutesDocs } from "../models/Docs";

export class UsersDocs extends Docs {
  private adminTag = "Admin";
  private userTag = "User";
  private userProfileTag = "User Profile";
  public routesDocs: RoutesDocs = [
    {
      path: "/admin/users",
      routeDocsArray: [this.getAllSchema()],
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
          500: http.code500Schema,
        },
        security: [],
      },
    };

    return newSchema;
  }
  getByIdSchema(): PathItemObject {
    const newSchema: PathItemObject = {
      get: {
        summary: "Retorna um usuário pelo ID",
        tags: [this.adminTag],
        parameters: [
          {
            $ref: "#/components/parameters/ParameterId",
          },
        ],
        responses: {
          200: http.code200Schema({
            user: {
              type: "string",
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
  createSchema(): PathItemObject {
    const newSchema: PathItemObject = {
      get: {
        summary: "Cadastra um usuário",
        description: "Cria um novo usuário e retorna um Json Web Token.",
        tags: [this.userTag],
        responses: {
          200: http.code200Schema({
            jwtToken: {
              type: "string",
            },
          }),
          400: http.validationErrorSchema,
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
        // body: this.userSchema,
        security: [],
      },
    };

    return newSchema;
  }
  deleteSchema(): PathItemObject {
    const newSchema: PathItemObject = {
      get: {
        summary: "Deleta o usuário atual",
        description:
          "Verifica o Bearer Token do usuário logado e exclui o usuário.",
        tags: [this.userTag],
        responses: {
          204: http.code204Schema,
          500: http.code500Schema,
        },
      },
    };

    return newSchema;
  }
  updateSchema(): PathItemObject {
    const newSchema: PathItemObject = {
      get: {
        summary: "Atualiza os dados do usuário atual",
        description:
          "Verifica o Bearer Token do usuário logado e atualiza para os dados informados no corpo da requisição.",
        tags: [this.userTag],
        responses: {
          204: http.code204Schema,
          500: http.code500Schema,
        },
        // body: this.updateUserSchema,
      },
    };

    return newSchema;
  }
  getActualSchema(): PathItemObject {
    const newSchema: PathItemObject = {
      get: {
        summary: "Retorna o usuário atual",
        description:
          "Verifica o Bearer Token do usuário logado e retorna o perfil de usuário ou apenas o email.",
        tags: [this.userTag],
        responses: {
          200: http.code200Schema({
            userProfile: {
              type: "string",
            },
            userEmail: {
              type: "string",
              format: "email",
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
  loginSchema(): PathItemObject {
    const newSchema: PathItemObject = {
      get: {
        summary: "Loga um usuário",
        description:
          "Verifica se existe um usuário com o email e senha informados, e retorna um Token JWT para conecta-lo a aplicação.",
        tags: [this.userTag],
        responses: {
          200: http.code200Schema({
            jwtToken: {
              type: "string",
            },
          }),
          400: http.validationErrorSchema,
          403: http.clientErrorSchema(
            "Sessão de usuário ativa",
            "Faça um 'relogin' ou inicie uma sessão com outro usuário"
          ),
          500: http.code500Schema,
        },
        // body: this.userSchema,
        security: [],
      },
    };

    return newSchema;
  }
  logoffSchema(): PathItemObject {
    const newSchema: PathItemObject = {
      get: {
        summary: "Desconecta o usuário",
        description: "Desconecta o usuário atual da aplicação.",
        tags: [this.userTag],
        responses: {
          204: http.code204Schema,
          500: http.code500Schema,
        },
        security: [],
      },
    };

    return newSchema;
  }
  getByProfileNameSchema(): PathItemObject {
    const newSchema: PathItemObject = {
      get: {
        summary: "Retorna um perfil de usuário pelo nome",
        tags: [this.userTag, this.userProfileTag],
        responses: {
          200: http.code200Schema({
            userProfile: {
              type: "string",
            },
          }),
          404: http.code404Schema,
          500: http.code500Schema,
        },
      },
    };

    return newSchema;
  }
  createProfileSchema(): PathItemObject {
    const newSchema: PathItemObject = {
      get: {
        summary: "Cria um perfil para o usuário atual",
        tags: [this.userTag, this.userProfileTag],
        responses: {
          201: http.code201Schema({
            userUrl: {
              type: "string",
              format: "url",
            },
          }),
          400: http.validationErrorSchema,
          403: http.clientErrorSchema(
            "Sessão de usuário ativa",
            "Faça um 'relogin' ou inicie uma sessão com outro usuário"
          ),
          500: http.code500Schema,
        },
        // body: this.userProfileSchemaDocs,
      },
    };

    return newSchema;
  }
  reloginSchema(): PathItemObject {
    const newSchema: PathItemObject = {
      get: {
        summary: "Reinicia a sessão atual do usuário",
        description:
          "Reinicia a sessão atual do usuário e retorna um novo Bearer Token",
        tags: [this.userTag],
        responses: {
          200: http.code200Schema({
            jwtToken: {
              type: "string",
            },
          }),
          400: http.clientErrorSchema(
            "Requisição inválida",
            "Usuário inexistente"
          ),
          500: http.code500Schema,
        },
        security: [],
      },
    };

    return newSchema;
  }
}
