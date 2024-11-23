import type { Post as PostClient } from "@prisma/client";

export type Post = Omit<PostClient, "id" | "createdAt" | "updatedAt">;
