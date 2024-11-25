import type { Post as PostClient } from "@prisma/client";

export type CreatePost = Omit<PostClient, "createdAt" | "updatedAt">;
