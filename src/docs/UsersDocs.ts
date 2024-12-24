import z from "zod";
import type { Schema } from "../types/Schema";
import { userReturnSchema } from "./components/userReturnSchema";
import { UserService } from "../services/UserService";
import { noContentSchema } from "./schemas/noContentSchema";
import { validationErrorSchema } from "./schemas/validationErrorSchema";
import { infoMessageSchema } from "./schemas/infoMessageSchema";
import { UserProfileService } from "../services/UserProfileService";
import { jsonWebTokenErrorSchema } from "./schemas/jsonWebTokenErrorSchema";
import { clientErrorSchema } from "./schemas/clientErrorSchema";
import { userProfileReturnSchema } from "./components/userProfileReturnSchema";
import { http } from "./schemas/http";
import { queryTakeSkipSchema } from "./schemas/queryTakeSkipSchema";

export class UsersDocs {
  private adminTag = "Admin";
  private userTag = "User";
  private userProfileTag = "User Profile";
  private userService = new UserService();
  private userProfileService = new UserProfileService();
  private userSchema = this.userService.userSchemaDocs;
  private updateUserSchema = this.userService.updateUserSchemaDocs;
  private userProfileSchemaDocs = this.userProfileService.userProfileSchemaDocs;

  getAllSchema(): Schema {
    const newSchema: Schema = {
      summary: "Lista todos os usuários",
      description:
        "Retorna uma lista de todos os usuários cadastrados no sistema.",
      tags: [this.adminTag],
      querystring: queryTakeSkipSchema,
      response: {
        200: http.code200Schema(
          z.object({
            users: userReturnSchema.array(),
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
      summary: "Retorna um usuário pelo ID",
      tags: [this.adminTag],
      response: {
        200: http.code200Schema(
          z.object({
            user: userReturnSchema,
          })
        ),
        404: http.code404Schema(clientErrorSchema),
        500: http.code500Schema(infoMessageSchema),
      },
      security: [],
    };

    return newSchema;
  }
  createSchema(): Schema {
    const newSchema: Schema = {
      summary: "Cadastra um usuário",
      description: "Cria um novo usuário e retorna um Json Web Token.",
      tags: [this.userTag],
      response: {
        200: http.code200Schema(
          z.object({
            jwtToken: z.string(),
          })
        ),
        400: http.validationErrorSchema(validationErrorSchema),
        406: http.clientErrorSchema(clientErrorSchema),
        409: http.code409Schema(clientErrorSchema),
        500: http.code500Schema(infoMessageSchema),
      },
      body: this.userSchema,
      security: [],
    };

    return newSchema;
  }
  deleteSchema(): Schema {
    const newSchema: Schema = {
      summary: "Deleta o usuário atual",
      description:
        "Verifica o Bearer Token do usuário logado e exclui o usuário.",
      tags: [this.userTag],
      response: {
        204: http.code204Schema(noContentSchema),
        500: http.code500Schema(infoMessageSchema),
      },
    };

    return newSchema;
  }
  updateSchema(): Schema {
    const newSchema: Schema = {
      summary: "Atualiza os dados do usuário atual",
      description:
        "Verifica o Bearer Token do usuário logado e atualiza para os dados informados no corpo da requisição.",
      tags: [this.userTag],
      response: {
        204: http.code204Schema(noContentSchema),
        500: http.code500Schema(infoMessageSchema),
      },
      body: this.updateUserSchema,
    };

    return newSchema;
  }
  getActualSchema(): Schema {
    const newSchema: Schema = {
      summary: "Retorna o usuário atual",
      description:
        "Verifica o Bearer Token do usuário logado e retorna o perfil de usuário ou apenas o email.",
      tags: [this.userTag],
      response: {
        200: http.code200Schema(
          z
            .object({
              userProfile: userProfileReturnSchema.optional(),
              userEmail: z.string().email().optional(),
            })
            .describe("Informações seguras sobre o usuário")
        ),
        404: http.code404Schema(
          clientErrorSchema
            .describe("Nenhum usuário logado encontrado")
            .default({
              message: "Nenhum usuário logado",
            })
        ),
        500: http.code500Schema(infoMessageSchema),
      },
      security: [],
    };

    return newSchema;
  }
  loginSchema(): Schema {
    const newSchema: Schema = {
      summary: "Loga um usuário",
      description:
        "Verifica se existe um usuário com o email e senha informados, e retorna um Token JWT para conecta-lo a aplicação.",
      tags: [this.userTag],
      response: {
        200: http.code200Schema(
          z.object({
            jwtToken: z.string(),
          })
        ),
        400: http.validationErrorSchema(validationErrorSchema),
        401: http.clientErrorSchema(
          clientErrorSchema.default({
            message: "Não foi possível fazer o login",
          })
        ),
        500: http.code500Schema(infoMessageSchema),
      },
      body: this.userSchema,
      security: [],
    };

    return newSchema;
  }
  logoffSchema(): Schema {
    const newSchema: Schema = {
      summary: "Desconecta o usuário",
      description: "Desconecta o usuário atual da aplicação.",
      tags: [this.userTag],
      response: {
        204: http.code204Schema(noContentSchema),
        500: http.code500Schema(infoMessageSchema),
      },
      security: [],
    };

    return newSchema;
  }
  getByProfileNameSchema(): Schema {
    const newSchema: Schema = {
      summary: "Retorna um perfil de usuário pelo nome",
      tags: [this.userTag, this.userProfileTag],
      response: {
        200: http.code200Schema(
          z.object({
            userProfile: userProfileReturnSchema,
          })
        ),
        404: http.code404Schema(clientErrorSchema),
        500: http.code500Schema(infoMessageSchema),
      },
      params: z.object({
        name: z.string(),
      }),
    };

    return newSchema;
  }
  createProfileSchema(): Schema {
    const newSchema: Schema = {
      summary: "Cria um perfil para o usuário atual",
      tags: [this.userTag, this.userProfileTag],
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
      body: this.userProfileSchemaDocs,
    };

    return newSchema;
  }
  reloginSchema(): Schema {
    const newSchema: Schema = {
      summary: "Reinicia a sessão atual do usuário",
      description:
        "Reinicia a sessão atual do usuário e retorna um novo Bearer Token",
      tags: [this.userTag],
      response: {
        200: http.code200Schema(
          z.object({
            jwtToken: z.string().describe("Novo Bearer Token do usuário"),
          })
        ),
        400: http.clientErrorSchema(clientErrorSchema),
        500: http.code500Schema(infoMessageSchema),
      },
      security: [],
    };

    return newSchema;
  }
}
