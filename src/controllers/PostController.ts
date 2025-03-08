import { v4 as uuidV4 } from "uuid";
import type { CreatePost } from "../types/CreatePost";
import type { RouteParams } from "../types/RouteParams";
import type { PostModel } from "../models/PostModel";
import type { PostService } from "../services/PostService";
import { replyErrorResponse } from "../utils/replyErrorResponse";
import { Controller } from "./Controller";
import { jsonWebToken } from "../utils/jsonWebToken";
import { getPostOrThrow } from "../utils/getPostOrThrow";
import { getUserOrThrow } from "../utils/getUserOrThrow";
import { ClientError } from "../errors/ClientError";

export class PostController extends Controller {
  constructor(
    private readonly postModel: PostModel,
    private readonly postService: PostService
  ) {
    super();
  }

  async getAll({ request, reply }: RouteParams) {
    try {
      const { take, skip } = this.postService.getQueryTakeSkip(request.query);
      const posts = await this.postModel.getAll(take, skip);

      return reply.code(200).send({ posts });
    } catch (error) {
      replyErrorResponse(error, reply);
    }
  }
  async getById({ request, reply }: RouteParams) {
    try {
      const { id } = this.postService.getParamId(request.params);
      const requiredPost = await getPostOrThrow(id);

      return reply.code(200).send({ post: requiredPost });
    } catch (error) {
      replyErrorResponse(error, reply);
    }
  }
  async create({ request, reply }: RouteParams) {
    try {
      const { userId } = await jsonWebToken.verifyUserPayload(request);
      const user = await getUserOrThrow(userId);
      if (!user.profile) {
        throw new ClientError(
          "O usuário precisa ter um perfil para criar posts",
          406
        );
      }

      const validatedPostBody = this.postService.validate(request.body);
      const newPost: CreatePost = {
        id: uuidV4(),
        ...validatedPostBody,
        authorId: user.profile.id,
        cover: "https://http.cat/200",
      };

      const { post } = await this.postModel.create(newPost);

      return reply.code(201).send({ postId: post.id });
    } catch (error) {
      replyErrorResponse(error, reply);
    }
  }
  async delete({ request, reply }: RouteParams) {
    try {
      await jsonWebToken.verifyUserPayload(request);
      const { id } = this.postService.getParamId(request.params);
      const requiredPost = await getPostOrThrow(id);

      await this.postModel.delete(requiredPost.id);
      return reply.code(204).send();
    } catch (error) {
      replyErrorResponse(error, reply);
    }
  }
  async update({ request, reply }: RouteParams) {
    try {
      const { userId } = await jsonWebToken.verifyUserPayload(request);
      const user = await getUserOrThrow(userId);
      if (!user.profile) {
        throw new ClientError("O usuário atual não possui um perfil.", 406);
      }

      const { id } = this.postService.getParamId(request.params);
      const userProfile = user.profile;
      const requiredPost = await getPostOrThrow(id);
      if (requiredPost.authorId !== userProfile.id) {
        throw new ClientError("O usuário atual não é dono desse post.", 401);
      }

      const postToUpdateBody = this.postService.validate(request.body);
      const newPost: CreatePost = {
        id,
        ...postToUpdateBody,
        authorId: user.profile.id,
        cover: requiredPost.cover,
      };

      await this.postModel.update(id, newPost);

      return reply.code(204).send();
    } catch (error) {
      replyErrorResponse(error, reply);
    }
  }
  async updateCover({ request, reply }: RouteParams) {
    try {
      await jsonWebToken.verifyUserPayload(request);
      const { id } = this.postService.getParamId(request.params);
      const postToUpdate = await getPostOrThrow(id);

      if (!request.isMultipart()) {
        throw new ClientError(
          "Requisição inválida. Precisa-se ser do tipo 'multipart/form-data'",
          400
        );
      }

      const file = await request.file();
      const { url } = await this.postService.uploadFile(file);

      await this.postModel.updateCover(postToUpdate.id, url);

      return reply.code(200).send({ imageUrl: url });
    } catch (error) {
      replyErrorResponse(error, reply);
    }
  }
  async getPostsByCategory({ request, reply }: RouteParams) {
    try {
      const params = this.postService.getObjectFromRequest(request.params, [
        "category",
      ]);
      const category = params.category;

      if (!category) {
        return reply
          .code(400)
          .send({ message: "Insira o nome de uma categoria" });
      }

      const { take, skip } = this.postService.getQueryTakeSkip(request.query);
      const posts = await this.postModel.getByField(
        { field: "category", value: category },
        take,
        skip
      );

      return reply.code(200).send({ posts });
    } catch (error) {
      replyErrorResponse(error, reply);
    }
  }
  async getPostsByUserName({ request, reply }: RouteParams) {
    try {
      const params = this.postService.getObjectFromRequest(request.params, [
        "name",
      ]);
      const userName = params.name;
      if (!userName) {
        return reply
          .code(400)
          .send({ message: "Insira o nome do autor do post" });
      }

      const { take, skip } = this.postService.getQueryTakeSkip(request.query);
      const posts = await this.postModel.getByAuthorName(userName, take, skip);

      return reply.code(200).send({ posts });
    } catch (error) {
      replyErrorResponse(error, reply);
    }
  }
}
