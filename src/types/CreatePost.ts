import type { Post as PostClient } from "@prisma/client";

export type CreatePost = Omit<
  PostClient,
  "cover" | "createdAt" | "updatedAt"
> & {
  cover?: string;
};
