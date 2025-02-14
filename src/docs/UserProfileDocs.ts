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
        this.deleteSchema(),
        this.updateSchema(),
      ],
    },
    {
      path: "/profiles/{id}",
      routeDocsArray: [this.getByIdSchema()],
    },
  ];

  getAllSchema(): PathItemObject {
    const newSchema: PathItemObject = {
      get: {
        summary: "Retorna todos os perfis de usuário",
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
              $ref: "#/components/schemas/UserProfile",
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
        security: [],
      },
    };

    return newSchema;
  }
  createSchema(): PathItemObject {
    const newSchema: PathItemObject = {
      post: {
        summary: "Cria um perfil para o usuário atual",
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
}
