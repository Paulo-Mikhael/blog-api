import { v4 as uuidV4 } from "uuid";
import type { CreatePost } from "../types/CreatePost";
import type { RouteParams } from "../types/RouteParams";
import type { PostModel } from "../models/PostModel";
import type { PostService } from "../services/PostService";
import { replyErrorResponse } from "../utils/replyErrorResponse";

export class PostController {
  constructor(
    private readonly postModel: PostModel,
    private readonly postService: PostService
  ) {}

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
      const { id } = this.postService.getParamId(request.params);
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
      };

      const createdPost = await this.postModel.create(newPost);

      return reply.code(201).send({ postId: createdPost.id });
    } catch (error) {
      replyErrorResponse(error, reply);
    }
  }
  async delete({ request, reply }: RouteParams) {
    try {
      const { id } = this.postService.getParamId(request.params);
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
      const { id } = this.postService.getParamId(request.params);
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
      };

      await this.postModel.update(newPost);

      reply.code(204);
    } catch (error) {
      replyErrorResponse(error, reply);
    }
  }
  async updateCover({ request, reply }: RouteParams) {
    try {
      const { id } = this.postService.getParamId(request.params);
      const requiredPost = await this.postModel.getById(id);
      if (!requiredPost) {
        return reply.code(404).send({ message: "Post não encontrado" });
      }
      if (!request.isMultipart()) {
        return reply.code(400).send({
          message:
            "Requisição inválida. Precisa-se ser do tipo 'multipart/form-data'",
        });
      }

      const fastifyMultipartFile = await request.file();

      const { url } = await this.postService.uploadFile(fastifyMultipartFile);

      await this.postModel.updateCover(id, url);

      reply.code(200).send({ imageUrl: url });
    } catch (error) {
      replyErrorResponse(error, reply);
    }
  }
  async getPostsByCategory({ request, reply }: RouteParams) {
    try {
      const params = this.postService.getRequestObject(request.params, [
        "category",
      ]);
      const category = params.category;

      if (!category) {
        return reply
          .code(400)
          .send({ message: "Insira o nome de uma categoria" });
      }

      const { take, skip } = this.postService.getQueryTakeSkip(request.query);
      const posts = await this.postModel.getPostsByCategory(
        category,
        take,
        skip
      );

      reply.code(200).send({ posts });
    } catch (error) {
      replyErrorResponse(error, reply);
    }
  }
  async getPostsByUserId({ request, reply }: RouteParams) {
    try {
      const params = this.postService.getRequestObject(request.params, [
        "userId",
      ]);
      const userId = params.userId;
      if (!userId) {
        return reply
          .code(400)
          .send({ message: "Insira o id do autor do post" });
      }

      const { take, skip } = this.postService.getQueryTakeSkip(request.query);
      const posts = await this.postModel.getPostsByUserId(userId, take, skip);

      reply.code(200).send({ posts });
    } catch (error) {
      replyErrorResponse(error, reply);
    }
  }
}
