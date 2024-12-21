import z from "zod";

export const jsonWebTokenErrorSchema = z
  .object({
    message: z.string(),
    error: z.string(),
  })
  .describe("Erro relacionado ao Bearer Token do cliente");
