import type { PathItemObject } from "../types/PathItemObject";
import type { RoutesDocs } from "../models/Docs";
import { CrudDocs } from "../models/CrudDocs";
import { http } from "./schemas/http";
import { requestBody } from "./schemas/requestBody";

export class AdminUserProfileDocs extends CrudDocs {
  private adminTag = "Admin";
  public routesDocs: RoutesDocs = [
    {
      path: "/admin/profiles/{id}",
      routeDocsArray: [
        this.createSchema(),
        this.deleteSchema(),
        this.updateSchema(),
      ],
    },
    {
      path: "/admin/profiles/avatar/{id}",
      routeDocsArray: [this.updateAvatarSchema()],
    },
  ];

  createSchema(): PathItemObject {
    const newSchema: PathItemObject = {
      post: {
        summary: "Cria um perfil para um usuário pelo id",
        description: "Cria um perfil para o usuário de id informado.",
        tags: [this.adminTag],
        parameters: [
          {
            $ref: "#/components/parameters/ParameterId",
          },
        ],
        responses: {
          201: http.code200Schema({
            userUrl: {
              type: "string",
              description: "Url do usuário",
            },
          }),
          400: http.validationErrorSchema,
          401: http.adminAcess401Error,
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
        summary:
          "Deleta um perfil de usuário pelo id e todos os post ligados à esse perfil.",
        description: "Deleta o perfil de usuário de id informado.",
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
  updateSchema(): PathItemObject {
    const newSchema: PathItemObject = {
      put: {
        summary: "Atualiza um perfil de usuário pelo id",
        description: "Atualiza os dados do perfil de usuário de id informado.",
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
        requestBody: requestBody.createUserProfile,
      },
    };

    return newSchema;
  }
  updateAvatarSchema(): PathItemObject {
    const newSchema: PathItemObject = {
      put: {
        summary: "Atualiza o avatar de um perfil de usuário pelo id",
        description: "Atualiza o avatar do perfil de usuário de id informado.",
        tags: [this.adminTag],
        parameters: [
          {
            $ref: "#/components/parameters/ParameterId",
          },
        ],
        responses: {
          200: http.code200Schema({
            imageUrl: { type: "string", description: "Url da imagem enviada." },
          }),
          401: http.adminAcess401Error,
          404: http.code404Schema,
          500: http.code500Schema,
        },
        requestBody: requestBody.updateUserAvatar,
      },
    };

    return newSchema;
  }
}
