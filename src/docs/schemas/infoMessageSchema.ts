import z from "zod";

export const infoMessageSchema = z.object({
  message: z.string().describe("Mensagem informativa retornada ao cliente"),
});
