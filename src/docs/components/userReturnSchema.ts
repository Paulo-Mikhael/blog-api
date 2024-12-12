import z from "zod";

export const userReturnSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  password: z.string(),
  profile: z
    .object({
      name: z.string(),
      id: z.string(),
      biography: z.string().nullable(),
      avatar: z.string(),
      userId: z.string(),
    })
    .nullable(),
});
