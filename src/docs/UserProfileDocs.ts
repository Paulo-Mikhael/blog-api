import type { Schema } from "../types/Schema";
import { UserProfileService } from "../services/UserProfileService";
import z from "zod";
import { userProfileReturnSchema } from "./components/userProfileReturnSchema";
import { noContentSchema } from "./schemas/noContentSchema";
import { infoMessageSchema } from "./schemas/infoMessageSchema";
import { validationErrorSchema } from "./schemas/validationErrorSchema";
import { http } from "./schemas/http";
import { jsonWebTokenErrorSchema } from "./schemas/jsonWebTokenErrorSchema";
import { queryTakeSkipSchema } from "./schemas/queryTakeSkipSchema";

export class UserProfileDocs {
  private userProfileTag = "User Profile";
  private userProfileService = new UserProfileService();
  private userProfileSchema = this.userProfileService.userProfileSchemaDocs;

  getAllSchema(): Schema {
    const newSchema: Schema = {
      summary: "Retorna todos os perfis de usuário",
      tags: [this.userProfileTag],
      querystring: queryTakeSkipSchema,
      response: {
        200: http.code200Schema(
          z.object({
            profiles: userProfileReturnSchema.array(),
          })
        ),
        500: http.code500Schema(infoMessageSchema),
      },
      security: [],
    };

    return newSchema;
  }
  getByIdSchema(): Schema {
    const newSchema: Schema = {
      summary: "Retorna um perfil de usuário por id",
      tags: [this.userProfileTag],
      response: {
        200: http.code200Schema(
          z.object({
            userProfile: userProfileReturnSchema,
          })
        ),
        400: http.validationErrorSchema(validationErrorSchema),
        500: http.code500Schema(infoMessageSchema),
      },
      security: [],
    };

    return newSchema;
  }
  createSchema(): Schema {
    const newSchema: Schema = {
      summary: "Cria um perfil para o usuário atual",
      tags: [this.userProfileTag],
      response: {
        200: http.code200Schema(
          z.object({
            userUrl: z.string().describe("url do perfil do usuário"),
          })
        ),
        400: http.validationErrorSchema(validationErrorSchema),
        401: http.code401Schema(jsonWebTokenErrorSchema),
        500: http.code500Schema(infoMessageSchema),
      },
      body: this.userProfileSchema,
    };

    return newSchema;
  }
  deleteSchema(): Schema {
    const newSchema: Schema = {
      summary: "Deleta o perfil do usuário atual",
      tags: [this.userProfileTag],
      response: {
        204: http.code204Schema(noContentSchema),
        401: http.code401Schema(jsonWebTokenErrorSchema),
        500: http.code500Schema(infoMessageSchema),
      },
    };

    return newSchema;
  }
  updateSchema(): Schema {
    const newSchema: Schema = {
      summary: "Atualiza o perfil do usuário atual",
      tags: [this.userProfileTag],
      response: {
        204: http.code204Schema(noContentSchema),
        401: http.code401Schema(jsonWebTokenErrorSchema),
        500: http.code500Schema(infoMessageSchema),
      },
      body: this.userProfileSchema,
    };

    return newSchema;
  }
}
