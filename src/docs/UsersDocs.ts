import z from "zod";
import type { Schema } from "../types/Schema";
import { userReturnSchema } from "./components/userReturnSchema";
import { UserService } from "../services/UserService";
import { noContentSchema } from "./schemas/NoContentSchema";

export class UsersDocs {
  private adminTag = "Admin";
  private userTag = "User";
  private userService = new UserService();
  private userSchema = this.userService.userSchema;
  private updateUserSchema = this.userService.updateUserSchema;

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
        204: noContentSchema,
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
        204: noContentSchema,
      },
      body: this.updateUserSchema,
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
        400: z.object({
          message: z.string(),
        }),
      },
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
        200: z.object({
          jwtToken: z.string(),
        }),
      },
      body: this.userSchema,
      security: [],
    };

    return newSchema;
  }
  logoffSchema(): Schema {
    const newSchema: Schema = {
      summary: "Desconecta um usuário",
      description: "Desconecta o usuário atual da aplicação.",
      tags: [this.userTag],
      response: {
        204: noContentSchema,
      },
      security: [],
    };

    return newSchema;
  }
}
