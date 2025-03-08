import { v4 as uuidV4 } from "uuid";
import type { UserProfileModel } from "../models/UserProfileModel";
import type { UserProfileService } from "../services/UserProfileService";
import type { RouteParams } from "../types/RouteParams";
import type { UserProfile } from "@prisma/client";
import { replyErrorResponse } from "../utils/replyErrorResponse";
import { Controller } from "./Controller";
import { getUserProfileOrThrow } from "../utils/getUserProfileOrThrow";
import { jsonWebToken } from "../utils/jsonWebToken";
import { getUserOrThrow } from "../utils/getUserOrThrow";
import { appDomain } from "../data/app_domain";
import { ClientError } from "../errors/ClientError";
import { createOrDeleteFile } from "../utils/createOrDeleteFile";

export class UserProfileController extends Controller {
  constructor(
    private readonly userProfileModel: UserProfileModel,
    private readonly userProfileService: UserProfileService
  ) {
    super();
  }

  async getAll({ request, reply }: RouteParams) {
    try {
      const { take, skip } = this.userProfileService.getQueryTakeSkip(
        request.query
      );
      const profiles = await this.userProfileModel.getAll(take, skip);

      return reply.code(200).send({ profiles });
    } catch (error) {
      replyErrorResponse(error, reply);
    }
  }
  async getById({ request, reply }: RouteParams) {
    try {
      const { id } = this.userProfileService.getParamId(request.params);
      const userProfile = await getUserProfileOrThrow(id);

      return reply.code(200).send({ userProfile });
    } catch (error) {
      replyErrorResponse(error, reply);
    }
  }
  async getByName({ request, reply }: RouteParams) {
    try {
      const { name } = this.userProfileService.getObjectFromRequest(
        request.params,
        ["name"]
      );
      if (!name) {
        throw new Error(
          "Não foi possível pegar o parâmetro 'name' da requisição"
        );
      }
      const userProfile = await this.userProfileModel.getByField({
        field: "name",
        value: name,
      });

      return reply.code(200).send({ userProfile });
    } catch (error) {
      replyErrorResponse(error, reply);
    }
  }
  async create({ request, reply }: RouteParams) {
    try {
      const { userId } = await jsonWebToken.verifyUserPayload(request);
      const validatedProfile = this.userProfileService.validate(request.body);
      const normalizedUserName = this.userProfileService
        .normalizeText(validatedProfile.name)
        .replaceAll(" ", "");
      const newProfile: UserProfile = {
        id: uuidV4(),
        avatar: "",
        userId,
        ...validatedProfile,
        name: normalizedUserName,
      };

      const user = await getUserOrThrow(userId);
      if (user.profile) {
        throw new ClientError("O usuário atual já possui um perfil", 401);
      }
      const { userProfile } = await this.userProfileModel.create(newProfile);

      return reply.code(201).send({
        userUrl: `${appDomain}/profiles/user/${userProfile.name}`,
      });
    } catch (error) {
      replyErrorResponse(error, reply);
    }
  }
  async delete({ request, reply }: RouteParams) {
    try {
      const { userId } = await jsonWebToken.verifyUserPayload(request);
      const user = await getUserOrThrow(userId);
      const userProfile = await getUserProfileOrThrow(user.profile?.id);

      await this.userProfileModel.delete(userProfile.id);

      return reply.code(204).send();
    } catch (error) {
      replyErrorResponse(error, reply);
    }
  }
  async update({ request, reply }: RouteParams) {
    try {
      const { userId } = await jsonWebToken.verifyUserPayload(request);
      const validatedBody = this.userProfileService.validate(request.body);
      const user = await getUserOrThrow(userId);
      const userProfile = await getUserProfileOrThrow(user.profile?.id);

      const newProfile: UserProfile = {
        ...validatedBody,
        id: userProfile.id,
        userId,
        avatar: userProfile.avatar,
      };
      await this.userProfileModel.update(userProfile.id, newProfile);

      return reply.code(204).send();
    } catch (error) {
      replyErrorResponse(error, reply);
    }
  }
  async updateAvatar({ request, reply }: RouteParams) {
    try {
      const { userId } = await jsonWebToken.verifyUserPayload(request);

      if (!request.isMultipart) {
        throw new ClientError(
          "Requisição inválida. Precisa-se ser do tipo 'multipart/form-data'"
        );
      }

      const file = await request.file();
      const { url } = await this.userProfileService.uploadFile(file);

      const user = await getUserOrThrow(userId);
      const userProfile = await getUserProfileOrThrow(user.profile?.id);

      await this.userProfileModel.updateAvatar(userProfile.id, url);

      return reply.code(200).send({ imageUrl: url });
    } catch (error) {
      replyErrorResponse(error, reply);
    }
  }
}
