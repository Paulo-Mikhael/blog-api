import z from "zod";

export const noContentSchema = z
  .string()
  .default("Success no content")
  .readonly();
