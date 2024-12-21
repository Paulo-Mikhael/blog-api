import z from "zod";

export const validationErrorSchema = z
  .object({
    message: z
      .string()
      .default("Dados inválidos")
      .describe("Mensagem padrão de erro de validação"),
    errors: z
      .object({
        property: z.string().describe("Nome da propriedade inválida"),
        error: z.string().describe("Motivo da inválidação"),
      })
      .array()
      .describe("Propriedades inválidas com seu erro de validação"),
  })
  .describe("Erro de validação");
