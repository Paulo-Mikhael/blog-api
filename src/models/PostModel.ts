import type { Post } from "@prisma/client";
import type { CreatePost } from "../types/CreatePost";
import type { MultipartFile } from "@fastify/multipart";
import db from "../db/dbConfig";
import { verifyForeignKeyError } from "../utils/verifyForeignKeyError";
import { PostService } from "../services/PostService";

export class PostModel {
  async getAll(take = 50, skip = 0): Promise<Post[]> {
    const posts = await db.post.findMany({
      orderBy: { createdAt: "desc" },
      take,
      skip,
    });

    return posts;
  }
  async getById(id: string): Promise<Post | null> {
    const requiredPost = await db.post.findUnique({
      where: { id },
    });

    return requiredPost;
  }
  async create(post: CreatePost): Promise<Post> {
    const createdPost = await db.post.create({ data: post }).catch((error) => {
      verifyForeignKeyError(error, ["authorId"]);

      throw new Error();
    });

    return createdPost;
  }
  async delete(id: string) {
    await db.post.delete({ where: { id } });
  }
  async update(postToUpdate: CreatePost): Promise<Post> {
    const updatedPost = await db.post
      .update({
        where: { id: postToUpdate.id },
        data: { ...postToUpdate },
      })
      .catch((error) => {
        verifyForeignKeyError(error, ["authorId"]);

        throw new Error();
      });

    return updatedPost;
  }
  async updateCover(id: string, coverUrl: string) {
    await db.post.update({ where: { id }, data: { cover: coverUrl } });
  }
  async getPostsByCategory(category: string, take = 50, skip = 0) {
    const postsByCategory = await db.post.findMany({
      where: { category },
      take,
      skip,
    });

    return postsByCategory;
  }
  async getPostsByUserId(userId: string, take = 50, skip = 0) {
    const postsByCategory = await db.post.findMany({
      where: { authorId: userId },
      take,
      skip,
    });

    return postsByCategory;
  }
}
