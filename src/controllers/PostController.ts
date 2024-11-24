import type { RouteParams } from "../types/RouteParams";
import { replyErrorResponse } from "../utils/replyErrorResponse";
import { PostModel } from "../models/PostModel";
import { PostService } from "../services/PostService";

export class PostController {
  private postModel = new PostModel();
  private postService = new PostService();

  async getAll({ request, reply }: RouteParams) {
    try {
      const query = this.postService.getQueryTakeSkip(request.query);
      const posts = await this.postModel.getAll(query.take, query.skip);

      reply.code(200).send(posts);
    } catch (error) {
      replyErrorResponse(error, reply);
    }
  }
  async getById({ request, reply }: RouteParams) {
    try {
      const id = this.postService.getParamId(request.params);
      const requiredPost = await this.postModel.getById(id);

      if (!requiredPost) {
        return reply.code(404).send({ message: "Post não encontrado" });
      }

      return reply.code(200).send(requiredPost);
    } catch (error) {
      replyErrorResponse(error, reply);
    }
  }
  async create({ request, reply }: RouteParams) {
    try {
      const validatedPost = this.postService.validate(request.body);
      const createdPost = await this.postModel.create(validatedPost);

      return reply.code(201).send({ postId: createdPost.id });
    } catch (error) {
      replyErrorResponse(error, reply);
    }
  }
  async delete({ request, reply }: RouteParams) {
    try {
      const id = this.postService.getParamId(request.params);
      const requiredPost = await this.postModel.getById(id);

      if (!requiredPost) {
        return reply.code(404).send({ message: "Post não encontrado" });
      }

      await this.postModel.delete(requiredPost.id);
      reply.code(200);
    } catch (error) {
      replyErrorResponse(error, reply);
    }
  }
}
