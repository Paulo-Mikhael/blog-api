import type { Post as PostDB } from "@prisma/client";
import type { Post } from "../types/Post";
import db from "../db/dbConfig";
import { verifyForeignKeyError } from "../utils/verifyForeignKeyError";

export class PostModel {
  async getAll(take = 50, skip = 0): Promise<PostDB[]> {
    const posts = await db.post.findMany({
      orderBy: { createdAt: "desc" },
      take,
      skip,
    });

    return posts;
  }
  async getById(id: string): Promise<PostDB | null> {
    const requiredPost = await db.post.findUnique({
      where: { id },
    });

    return requiredPost;
  }
  async create(post: Post): Promise<PostDB> {
    const createdPost = await db.post.create({ data: post }).catch((error) => {
      verifyForeignKeyError(error, ["authorId"]);

      throw new Error();
    });

    return createdPost;
  }
  async delete(id: string) {
    await db.post.delete({ where: { id } });
  }
}
