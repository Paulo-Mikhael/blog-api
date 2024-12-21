import z from "zod";

export const clientErrorSchema = z.object({
  message: z.string().describe("Mensagem informando erro causado pelo cliente"),
});
