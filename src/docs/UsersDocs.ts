import z from "zod";
import type { Schema } from "../types/Schema";
import { userReturnSchema } from "./components/userReturnSchema";
import { UserService } from "../services/UserService";

export class UsersDocs {
  private adminTag = "Admin";
  private userTag = "User";
  private userSchema = new UserService().userSchema;

  getAllSchema(): Schema {
    const newSchema: Schema = {
      summary: "Lista todos os usuários",
      description:
        "Essa rota retorna uma lista de todos os usuários cadastrados no sistema.",
      tags: [this.adminTag],
      response: {
        200: z.object({
          users: userReturnSchema.array(),
        }),
      },
      security: [],
    };

    return newSchema;
  }
  getByIdSchema(): Schema {
    const newSchema: Schema = {
      summary: "Retorna um usuário pelo ID",
      description: "Essa rota retorna o usuário especificado pelo ID.",
      tags: [this.adminTag],
      response: {
        200: z.object({
          user: userReturnSchema,
        }),
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
        200: z.object({
          jwtToken: z.string(),
        }),
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
        204: z.object({
          message: z.string().default("Success no content"),
        }),
      },
    };

    return newSchema;
  }
  getActualSchema(): Schema {
    const newSchema: Schema = {
      summary: "Retorna o usuário atual",
      description:
        "Verifica o Bearer Token do usuário logado e retorna o usuário.",
      tags: [this.userTag],
      response: {
        200: z.object({
          userUrl: z.string().optional(),
          userEmail: z.string().email().optional(),
        }),
      },
    };

    return newSchema;
  }
}
