import type { FastifyReply } from "fastify";
import { PostModel } from "../models/PostModel";

export async function getPostOrThrow(id: string, reply: FastifyReply) {
  const postModel = new PostModel();
  const requiredPost = await postModel.getById(id);

  if (!requiredPost) {
    return reply.code(404).send({ message: "Post não encontrado" });
  }

  return requiredPost;
}
