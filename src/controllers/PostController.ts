import type { RouteParams } from "../types/RouteParams";
import { replyErrorResponse } from "../utils/replyErrorResponse";
import { PostModel } from "../models/PostModel";
import { PostService } from "../services/PostService";

export class PostController {
  private postModel = new PostModel();
  private postService = new PostService();

  async getAll({ reply }: RouteParams) {
    try {
      const posts = await this.postModel.getAll();

      reply.send(posts);
    } catch (error) {
      replyErrorResponse(error, reply);
    }
  }
  async getById({ request, reply }: RouteParams) {
    try {
      const id = this.postService.validateParamId(request.params);
      const requiredPost = await this.postModel.getById(id);

      return requiredPost;
    } catch (error) {
      replyErrorResponse(error, reply);
    }
  }
  async create({ reply, request }: RouteParams) {
    try {
      const createdPost = await this.postModel.create(request.body);
      reply.code(201).send({ postId: createdPost.id });
    } catch (error) {
      replyErrorResponse(error, reply);
    }
  }
}
