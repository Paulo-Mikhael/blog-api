import z from "zod";

export const userReturnSchema = z
  .object({
    id: z.string().describe("Identificador único do usuário"),
    email: z
      .string()
      .email()
      .describe("Endereço de e-mail válido associado ao usuário"),
    password: z.string().describe("Senha do usuário"),
    profile: z
      .object({
        name: z.string().describe("Nome completo do usuário no perfil"),
        id: z.string().describe("Identificador único do perfil"),
        biography: z
          .string()
          .nullable()
          .describe("Texto biográfico do usuário, pode ser nulo"),
        avatar: z.string().describe("URL para a imagem de avatar do perfil"),
        userId: z
          .string()
          .describe("Identificador único do usuário associado ao perfil"),
      })
      .nullable()
      .describe("Dados do perfil do usuário, pode ser nulo"),
  })
  .describe(
    "Informações do usuário de forma completa, retornadas ao administrador"
  );
