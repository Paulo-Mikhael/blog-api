import type { PostModel } from "../models/PostModel";
import type { PostService } from "../services/PostService";
import type { CreatePost } from "../types/CreatePost";
import type { RouteParams } from "../types/RouteParams";
import { ClientError } from "../errors/ClientError";
import { getPostOrThrow } from "../utils/getPostOrThrow";
import { getUserOrThrow } from "../utils/getUserOrThrow";
import { replyErrorResponse } from "../utils/replyErrorResponse";
import { v4 as uuidV4 } from "uuid";
import { verifyAdminUser } from "../utils/verifyAdminUser";
import { CrudController } from "../models/CrudController";

export class AdminPostController extends CrudController {
  constructor(
    private postModel: PostModel,
    private postService: PostService
  ) {
    super();
  }

  async create({ request, reply }: RouteParams) {
    try {
      await verifyAdminUser(request);

      const { id } = this.postService.getParamId(request.params);
      const user = await getUserOrThrow(id);
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
      await verifyAdminUser(request);

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
      await verifyAdminUser(request);

      const { id } = this.postService.getParamId(request.params);
      const requiredPost = await getPostOrThrow(id);

      const postToUpdateBody = this.postService.validate(request.body);
      const newPost: CreatePost = {
        id,
        ...postToUpdateBody,
        authorId: requiredPost.authorId,
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
      await verifyAdminUser(request);

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
}
