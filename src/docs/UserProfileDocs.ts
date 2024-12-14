import type { Schema } from "../types/Schema";
import { UserProfileService } from "../services/UserProfileService";
import z from "zod";
import { userProfileReturnSchema } from "./components/userProfileReturnSchema";
import { noContentSchema } from "./schemas/noContentSchema";
import { infoMessageSchema } from "./schemas/infoMessageSchema";

export class UserProfileDocs {
  private userProfileTag = "User Profile";
  private userProfileService = new UserProfileService();
  private userProfileSchema = this.userProfileService.userProfileSchema;

  getAllSchema(): Schema {
    const newSchema: Schema = {
      summary: "Retorna todos os perfis de usuário",
      tags: [this.userProfileTag],
      response: {
        200: z.object({
          profiles: userProfileReturnSchema.array(),
        }),
        500: infoMessageSchema,
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
        200: z.object({
          userProfile: userProfileReturnSchema,
        }),
        500: infoMessageSchema,
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
        200: z.object({
          userUrl: z.string().describe("url do perfil do usuário"),
        }),
        500: infoMessageSchema,
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
        204: noContentSchema,
        500: infoMessageSchema,
      },
    };

    return newSchema;
  }
  updateSchema(): Schema {
    const newSchema: Schema = {
      summary: "Atualiza o perfil do usuário atual",
      tags: [this.userProfileTag],
      response: {
        204: noContentSchema,
        500: infoMessageSchema,
      },
      body: this.userProfileSchema,
    };

    return newSchema;
  }
}
