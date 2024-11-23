import type { RouteParams } from "../types/RouteParams";
import { replyErrorResponse } from "../utils/replyErrorResponse";
import { PostModel } from "../models/PostModel";

export class PostController {
  private postModel = new PostModel();

  async getAll({ request, reply }: RouteParams) {
    reply.send({ message: "OK" });
  }
  async create({ reply, request }: RouteParams) {
    try {
      const createdPost = await this.postModel.create(request.body);
      reply.code(201).send(createdPost);
    } catch (error) {
      replyErrorResponse(error, reply);
    }
  }
}
