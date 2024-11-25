import { v4 as uuidV4 } from "uuid";
import type { CreatePost } from "../types/CreatePost";
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
      const validatedPostBody = this.postService.validate(request.body);
      const newPost: CreatePost = {
        id: uuidV4(),
        ...validatedPostBody,
        cover: "",
        slug: this.postService.getSlug(validatedPostBody.title),
      };

      const createdPost = await this.postModel.create(newPost);

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
      reply.code(204);
    } catch (error) {
      replyErrorResponse(error, reply);
    }
  }
  async update({ request, reply }: RouteParams) {
    try {
      const id = this.postService.getParamId(request.params);
      const requiredPost = await this.postModel.getById(id);
      if (!requiredPost) {
        return reply.code(404).send({ message: "Post não encontrado" });
      }
      const postToUpdateBody = this.postService.validate(request.body);
      const updatedCover = postToUpdateBody.cover;
      const newPost: CreatePost = {
        id,
        ...postToUpdateBody,
        cover: updatedCover ? updatedCover : requiredPost.cover,
        slug: this.postService.getSlug(postToUpdateBody.title),
      };

      await this.postModel.update(newPost);

      reply.code(204);
    } catch (error) {
      replyErrorResponse(error, reply);
    }
  }
  async updateCover({ request, reply }: RouteParams) {
    try {
      const fastifyMultipart = await request.file();
      const file = fastifyMultipart?.filename;

      reply.code(200).send({ message: file });
    } catch (error) {
      replyErrorResponse(error, reply);
    }
  }
}
