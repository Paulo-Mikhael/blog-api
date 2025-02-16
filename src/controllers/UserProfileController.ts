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
      const { userId } = await jsonWebToken.verify(request);
      const validatedProfile = await this.userProfileService.validate(
        request.body
      );
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
      const { userProfile } = await this.userProfileModel.create(newProfile);

      return reply.code(201).send({
        userUrl: `${appDomain}/users/profile/${userProfile.name}`,
      });
    } catch (error) {
      replyErrorResponse(error, reply);
    }
  }
  async delete({ request, reply }: RouteParams) {
    try {
      const { userId } = await jsonWebToken.verify(request);
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
      const { userId } = await jsonWebToken.verify(request);
      const validatedBody = this.userProfileService.validate(request.body);
      const user = await getUserOrThrow(userId);
      const userProfile = await getUserProfileOrThrow(user.profile?.id);

      const newProfile: UserProfile = {
        id: userProfile.id,
        userId,
        avatar: userProfile.avatar,
        ...validatedBody,
      };
      await this.userProfileModel.update(userProfile.id, newProfile);

      return reply.code(204).send();
    } catch (error) {
      replyErrorResponse(error, reply);
    }
  }
}
