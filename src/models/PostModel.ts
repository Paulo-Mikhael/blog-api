import type { Post } from "@prisma/client";
import db from "../db/dbConfig";
import { PostService } from "../services/PostService";
import type { FastifyError } from "fastify";
import { verifyForeignKeyError } from "../utils/verifyForeignKeyError";

export class PostModel {
  private postService = new PostService();

  async create(body: unknown): Promise<Post> {
    const validatedPost = this.postService.validate(body);

    const createdPost = await db.post
      .create({ data: validatedPost })
      .catch((error: FastifyError) => {
        verifyForeignKeyError(error, ["authorId"]);

        throw new Error();
      });

    return createdPost;
  }
}
