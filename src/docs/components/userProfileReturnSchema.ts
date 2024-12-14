import z from "zod";

export const userProfileReturnSchema = z
  .object({
    id: z.string().describe("Identificador único do perfil do usuário"),
    name: z.string().describe("Nome completo do usuário no perfil"),
    biography: z
      .string()
      .nullable()
      .describe("Texto biográfico sobre o usuário, pode ser nulo"),
    avatar: z.string().describe("URL para a imagem de avatar do perfil"),
    email: z
      .string()
      .email()
      .describe("Endereço de e-mail associado ao perfil do usuário"),
  })
  .describe("Informações do usuário retornados de forma segura");
