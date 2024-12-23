import z from "zod";

export const queryTakeSkipSchema = z.object({
  take: z.string().default("50"),
  skip: z.string().default("0"),
});
