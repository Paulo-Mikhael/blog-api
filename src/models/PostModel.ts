import type { Post } from "@prisma/client";
import db from "../db/dbConfig";
import { PostService } from "../services/PostService";
import { verifyForeignKeyError } from "../utils/verifyForeignKeyError";

export class PostModel {
  private postService = new PostService();

  async getAll() {
    const posts = await db.post.findMany({ orderBy: { createdAt: "desc" } });

    return posts;
  }
  async getById(id: number) {
    const requiredPost = await db.post.findUnique({
      where: {
        id: id,
      },
    });

    return requiredPost;
  }
  async create(body: unknown): Promise<Post> {
    const validatedPost = this.postService.validate(body);

    const createdPost = await db.post
      .create({ data: validatedPost })
      .catch((error) => {
        verifyForeignKeyError(error, ["authorId"]);

        throw new Error();
      });

    return createdPost;
  }
}
