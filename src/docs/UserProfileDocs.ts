import type { PathItemObject } from "../types/PathItemObject";
import type { RoutesDocs } from "../models/Docs";
import { requestBody } from "./schemas/requestBody";
import { http } from "./schemas/http";

export class UserProfileDocs {
  private userProfileTag = "User Profile";
  public routeDocs: RoutesDocs = [
    {
      path: "/profiles",
      routeDocsArray: [
        this.getAllSchema(),
        this.createSchema(),
        this.updateSchema(),
        this.deleteSchema(),
      ],
    },
    {
      path: "/profiles/avatar",
      routeDocsArray: [this.updateAvatarSchema()],
    },
    {
      path: "/profiles/{id}",
      routeDocsArray: [this.getByIdSchema()],
    },
    {
      path: "/profiles/user/{name}",
      routeDocsArray: [this.getByNameSchema()],
    },
  ];

  getAllSchema(): PathItemObject {
    const newSchema: PathItemObject = {
      get: {
        summary: "Retorna todos os perfis de usuário",
        description:
          "Retorna uma lista com todos os perfis de usuários da aplicação. Qualquer usuário pode acessar.",
        tags: [this.userProfileTag],
        parameters: [
          {
            $ref: "#/components/parameters/QueryTake",
          },
          {
            $ref: "#/components/parameters/QuerySkip",
          },
        ],
        responses: {
          200: http.code200Schema({
            userProfiles: {
              type: "array",
              items: {
                $ref: "#/components/schemas/UserProfile",
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
        summary: "Retorna um perfil de usuário por id",
        description:
          "Retorna um perfil de usuário cadastrado na aplicação. Qualquer usuário pode acessar.",
        tags: [this.userProfileTag],
        responses: {
          200: http.code200Schema({
            userProfiles: {
              $ref: "#/components/schemas/UserProfile",
            },
          }),
          400: http.validationErrorSchema,
          500: http.code500Schema,
        },
        parameters: [
          {
            $ref: "#/components/parameters/ParameterId",
          },
        ],
        security: [],
      },
    };

    return newSchema;
  }
  getByNameSchema(): PathItemObject {
    const newSchema: PathItemObject = {
      get: {
        summary: "Retorna um perfil de usuário pelo nome",
        description:
          "Retorna um perfil de usuário cadastrado na aplicação. Qualquer usuário pode acessar.",
        tags: [this.userProfileTag],
        responses: {
          200: http.code200Schema({
            userProfile: {
              type: "array",
              items: {
                $ref: "#/components/schemas/UserProfile",
              },
            },
          }),
          404: http.code404Schema,
          500: http.code500Schema,
        },
        parameters: [
          {
            $ref: "#/components/parameters/ParameterName",
          },
        ],
        security: [],
      },
    };

    return newSchema;
  }
  createSchema(): PathItemObject {
    const newSchema: PathItemObject = {
      post: {
        summary: "Cria um perfil para o usuário atual",
        description:
          "Verifica o Bearer Token do usuário atual e cria um perfil para ele.",
        tags: [this.userProfileTag],
        responses: {
          201: http.code200Schema({
            userUrl: {
              type: "string",
              description: "Url do usuário",
            },
          }),
          400: http.validationErrorSchema,
          401: http.tokenJWTErrorSchema,
          500: http.code500Schema,
        },
        requestBody: requestBody.createUserProfile,
      },
    };

    return newSchema;
  }
  deleteSchema(): PathItemObject {
    const newSchema: PathItemObject = {
      delete: {
        summary: "Deleta o perfil do usuário atual",
        description:
          "Verifica o Bearer Token do usuário atual e deleta o perfil dele.",
        tags: [this.userProfileTag],
        responses: {
          204: http.code204Schema,
          401: http.tokenJWTErrorSchema,
          500: http.code500Schema,
        },
      },
    };

    return newSchema;
  }
  updateSchema(): PathItemObject {
    const newSchema: PathItemObject = {
      put: {
        summary: "Atualiza o perfil do usuário atual",
        description:
          "Verifica o Bearer Token do usuário atual e atualiza as informações do perfil dele.",
        tags: [this.userProfileTag],
        responses: {
          204: http.code204Schema,
          401: http.tokenJWTErrorSchema,
          500: http.code500Schema,
        },
        requestBody: requestBody.createUserProfile,
      },
    };

    return newSchema;
  }
  updateAvatarSchema(): PathItemObject {
    const newSchema: PathItemObject = {
      put: {
        summary: "Atualiza o avatar do usuário atual",
        description:
          "Verifica o Bearer Token do usuário atual e atualiza o avatar do usuário.",
        tags: [this.userProfileTag],
        responses: {
          200: http.code200Schema({
            imageUrl: { type: "string", description: "Url da imagem enviada." },
          }),
          401: http.tokenJWTErrorSchema,
          404: http.code404Schema,
          500: http.code500Schema,
        },
        requestBody: requestBody.updateUserAvatar,
      },
    };

    return newSchema;
  }
}
