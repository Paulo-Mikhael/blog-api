import z from "zod";

export const jsonWebTokenErrorSchema = z.object({
  message: z.string().default("Token JWT inválido"),
  error: z.string().describe("Erro sobre o Bearer Token do usuário"),
});
