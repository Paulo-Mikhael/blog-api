import type { RoutesDocs } from "../models/Docs";
import type { PathItemObject } from "../types/PathItemObject";
import { http } from "./schemas/http";
import { requestBody } from "./schemas/requestBody";

abstract class BaseDocs {
  abstract routesDocs: RoutesDocs;

  abstract createSchema(): PathItemObject;
  abstract deleteSchema(): PathItemObject;
  abstract updateSchema(): PathItemObject;
}

export class UsersDocs extends BaseDocs {
  private userTag = "User";
  public routesDocs: RoutesDocs = [
    {
      path: "/users/actual",
      routeDocsArray: [this.getActualSchema()],
    },
    {
      path: "/users",
      routeDocsArray: [
        this.createSchema(),
        this.updateSchema(),
        this.deleteSchema(),
      ],
    },
    {
      path: "/users/posts",
      routeDocsArray: [this.getPostsSchema()],
    },
    {
      path: "/users/login",
      routeDocsArray: [this.loginSchema()],
    },
    {
      path: "/users/logoff",
      routeDocsArray: [this.logoffSchema()],
    },
    {
      path: "/users/relogin",
      routeDocsArray: [this.reloginSchema()],
    },
    {
      path: "/users/recuperation-email",
      routeDocsArray: [this.sendRecuperationEmailSchema()],
    },
    {
      path: "/users/recuperation-code",
      routeDocsArray: [this.sendRecuperationCodeSchema()],
    },
  ];

  createSchema(): PathItemObject {
    const newSchema: PathItemObject = {
      post: {
        summary: "Cadastra um usuário",
        description: "Cria um novo usuário e retorna um Json Web Token.",
        tags: [this.userTag],
        responses: {
          201: http.code200Schema({
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
        requestBody: requestBody.createUser,
        security: [],
      },
    };

    return newSchema;
  }
  deleteSchema(): PathItemObject {
    const newSchema: PathItemObject = {
      delete: {
        summary: "Deleta o usuário atual",
        description:
          "Verifica o Bearer Token do usuário logado e exclui o usuário.",
        tags: [this.userTag],
        responses: {
          204: http.code204Schema,
          401: http.tokenJWTErrorSchema,
          500: http.code500Schema,
        },
        security: [{ BearerAuth: [] }],
      },
    };

    return newSchema;
  }
  updateSchema(): PathItemObject {
    const newSchema: PathItemObject = {
      put: {
        summary: "Atualiza os dados do usuário atual",
        description:
          "Verifica o Bearer Token do usuário logado e atualiza o e-mail e senha do usuário, sendo necessário informar a senha antiga para isso.",
        tags: [this.userTag],
        responses: {
          204: http.code204Schema,
          401: http.clientErrorSchema(
            "Acesso não autorizado",
            "Senha incorreta"
          ),
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
        security: [{ BearerAuth: [] }],
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
              $ref: "#/components/schemas/UserProfile",
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
      post: {
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
          401: http.clientErrorSchema("Acesso negado", "Senha incorreta"),
          403: http.clientErrorSchema(
            "Sessão de usuário ativa",
            "Faça um 'relogin' ou inicie uma sessão com outro usuário"
          ),
          500: http.code500Schema,
        },
        requestBody: requestBody.createUser,
        security: [],
      },
    };

    return newSchema;
  }
  logoffSchema(): PathItemObject {
    const newSchema: PathItemObject = {
      post: {
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
  getPostsSchema(): PathItemObject {
    const newSchema: PathItemObject = {
      get: {
        summary: "Retorna os posts do usuário atual",
        description:
          "Verifica o Bearer Token do usuário atual e retorna os posts pertecentes à ele.",
        tags: [this.userTag],
        responses: {
          200: http.code200Schema({
            userPosts: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Post",
              },
            },
          }),
          400: http.clientErrorSchema(
            "Perfil de usuário inexistente",
            "Perfil de usuário inexistente. O usuário precisa ter um perfil para criar posts."
          ),
          404: http.clientErrorSchema("Nenhum usuário logado"),
          500: http.code500Schema,
        },
        security: [{ BearerAuth: [] }],
      },
    };

    return newSchema;
  }
  sendRecuperationEmailSchema(): PathItemObject {
    const newSchema: PathItemObject = {
      post: {
        summary: "Envia um email de recuperação de senha ao usuário atual",
        description:
          "Verifica o Bearer Token do usuário atual e envia um email de recuperação de senha.",
        tags: [this.userTag],
        responses: {
          200: http.code200Schema({
            message: {
              type: "string",
            },
          }),
          400: http.clientErrorSchema(
            "Perfil de usuário inexistente",
            "Perfil de usuário inexistente. O usuário precisa ter um perfil para criar posts."
          ),
          401: http.tokenJWTErrorSchema,
          404: http.clientErrorSchema("Nenhum usuário logado"),
          500: http.code500Schema,
        },
        security: [{ BearerAuth: [] }],
      },
    };

    return newSchema;
  }
  sendRecuperationCodeSchema(): PathItemObject {
    const newSchema: PathItemObject = {
      post: {
        summary:
          "Envia o código de recuperação recebido por email para ser verificado",
        description: "Verifica o código de recuperação recebido por email.",
        tags: [this.userTag],
        responses: {
          200: http.code200Schema({
            recuperationCode: {
              type: "string",
            },
          }),
          400: http.clientErrorSchema(
            "Perfil de usuário inexistente",
            "Perfil de usuário inexistente. O usuário precisa ter um perfil para criar posts."
          ),
          401: http.clientErrorSchema("Acesso negado", "Código incorreto"),
          500: http.code500Schema,
        },
        security: [],
        requestBody: requestBody.create({
          properties: { recuperationCode: { type: "string" } },
          requiredProperties: ["recuperationCode"],
        }),
      },
    };

    return newSchema;
  }
}
