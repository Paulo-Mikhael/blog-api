import type { Post } from "@prisma/client";
import type { CreatePost } from "../types/CreatePost";
import type { FastifyError as FE } from "fastify";
import type { FieldParams } from "../types/FieldParams";
import db from "../db/dbConfig";
import { Model } from "./Model";
import { PrismaError } from "../errors/PrismaError";

export class PostModel extends Model<Post> {
  async getAll(take = 50, skip = 0): Promise<Post[]> {
    const posts = await db.post.findMany({
      orderBy: { createdAt: "desc" },
      take,
      skip,
    });

    return posts;
  }
  async getById(id: string) {
    const requiredPost = await db.post.findUnique({
      where: { id },
    });

    return requiredPost;
  }
  async create(post: CreatePost) {
    const createdPost = await db.post
      .create({ data: post })
      .catch((error: FE) => {
        throw new PrismaError(error, { foreignKeys: ["authorId"] });
      });

    return { post: createdPost };
  }
  async delete(id: string) {
    await db.post.delete({ where: { id } });

    return;
  }
  async update(id: string, newPost: CreatePost) {
    await db.post
      .update({
        where: { id },
        data: { ...newPost },
      })
      .catch((error) => {
        throw new PrismaError(error, { foreignKeys: ["authorId"] });
      });

    return;
  }
  async getByField(fieldParams: FieldParams<Post>, take = 50, skip = 0) {
    const postsByField = await db.post.findMany({
      where: { [fieldParams.field]: fieldParams.value },
      take,
      skip,
    });

    return postsByField;
  }
  async getByAuthorName(name: string, take = 50, skip = 0) {
    const postsByName = await db.post.findMany({
      where: { author: { name } },
      take,
      skip,
    });

    return postsByName;
  }
  async updateCover(id: string, coverUrl: string) {
    await db.post.update({ where: { id }, data: { cover: coverUrl } });

    return;
  }
  async deleteByAuthorId(authorId: string) {
    await db.post.deleteMany({ where: { authorId } });

    return;
  }
}
