import type { RouteParams } from "../types/RouteParams";
import { replyErrorResponse } from "../utils/replyErrorResponse";
import { PostService } from "../services/PostService";

export class PostController {
  private postService = new PostService();

  async getAll({ request, reply }: RouteParams) {
    reply.send({ message: "OK" });
  }
  async create({ reply, request }: RouteParams) {
    try {
      const user = this.postService.validate(request.body);
      const createdPost = await this.postService.create(user);

      reply.send(createdPost);
    } catch (error) {
      replyErrorResponse(error, reply);
    }
  }
}