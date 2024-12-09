import { v4 as uuidV4 } from "uuid";
import type { UserProfileModel } from "../models/UserProfileModel";
import type { UserProfileService } from "../services/UserProfileService";
import type { RouteParams } from "../types/RouteParams";
import type { UserProfile } from "@prisma/client";
import { replyErrorResponse } from "../utils/replyErrorResponse";
import { Controller } from "./Controller";
import { getUserProfileOrThrow } from "../utils/getUserProfileOrThrow";

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
  async create({ request, reply }: RouteParams) {
    try {
      const validatedProfile = this.userProfileService.validate(request.body);
      const normalizedUserName = this.userProfileService
        .normalizeText(validatedProfile.name)
        .replaceAll(" ", "");
      const newProfile: UserProfile = {
        id: uuidV4(),
        ...validatedProfile,
        name: normalizedUserName,
      };
      const { userProfile } = await this.userProfileModel.create(newProfile);

      return reply
        .code(200)
        .send({ userUrl: `/users/profile/${userProfile.name}` });
    } catch (error) {
      replyErrorResponse(error, reply);
    }
  }
  async delete({ request, reply }: RouteParams) {
    try {
      const { id } = this.userProfileService.getParamId(request.params);
      const profile = await getUserProfileOrThrow(id);
      await this.userProfileModel.delete(profile.id);

      return reply.code(204).send();
    } catch (error) {
      replyErrorResponse(error, reply);
    }
  }
  async update({ request, reply }: RouteParams) {
    try {
      const { id } = this.userProfileService.getParamId(request.params);
      const validatedBody = this.userProfileService.validate(request.body);
      const requiredProfile = await getUserProfileOrThrow(id);

      const newProfile: UserProfile = {
        id: requiredProfile.id,
        ...validatedBody,
      };
      await this.userProfileModel.update(id, newProfile);

      return reply.code(204).send();
    } catch (error) {
      replyErrorResponse(error, reply);
    }
  }
}
