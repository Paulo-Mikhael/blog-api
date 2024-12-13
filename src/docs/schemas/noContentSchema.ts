import z from "zod";

export const noContentSchema = z.object({
  message: z.string().default("Success no content"),
});
