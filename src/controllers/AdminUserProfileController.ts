import type { UserProfile } from "@prisma/client";
import type { RouteParams } from "../types/RouteParams";
import type { UserProfileModel } from "../models/UserProfileModel";
import type { UserProfileService } from "../services/UserProfileService";
import { appDomain } from "../data/app_domain";
import { ClientError } from "../errors/ClientError";
import { CrudController } from "../models/CrudController";
import { getUserOrThrow } from "../utils/getUserOrThrow";
import { getUserProfileOrThrow } from "../utils/getUserProfileOrThrow";
import { jsonWebToken } from "../utils/jsonWebToken";
import { replyErrorResponse } from "../utils/replyErrorResponse";
import { v4 as uuidV4 } from "uuid";
import { verifyAdminUser } from "../utils/verifyAdminUser";
import { UserModel } from "../models/UserModel";
import { PostModel } from "../models/PostModel";

export class AdminUserProfileController extends CrudController {
  constructor(
    private userProfileModel: UserProfileModel,
    private userProfileService: UserProfileService
  ) {
    super();
  }

  async create({ request, reply }: RouteParams) {
    try {
      await verifyAdminUser(request);

      const { id } = this.userProfileService.getParamId(request.params);
      const user = await getUserOrThrow(id);

      const validatedProfile = this.userProfileService.validate(request.body);
      const normalizedUserName = this.userProfileService
        .normalizeText(validatedProfile.name)
        .replaceAll(" ", "");
      const newProfile: UserProfile = {
        id: uuidV4(),
        avatar: "",
        userId: user.id,
        ...validatedProfile,
        name: normalizedUserName,
      };
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
      await verifyAdminUser(request);

      const { id } = this.userProfileService.getParamId(request.params);
      const userProfile = await getUserProfileOrThrow(id);

      await this.userProfileModel.delete(userProfile.id);

      return reply.code(204).send();
    } catch (error) {
      replyErrorResponse(error, reply);
    }
  }
  async update({ request, reply }: RouteParams) {
    try {
      await verifyAdminUser(request);

      const { id } = this.userProfileService.getParamId(request);
      const validatedBody = this.userProfileService.validate(request.body);
      const normalizedUserName = this.userProfileService
        .normalizeText(validatedBody.name)
        .replaceAll(" ", "");
      const userProfile = await getUserProfileOrThrow(id);

      const userModel = new UserModel();
      const user = await userModel.getByEmailAddress(userProfile.email);

      const newProfile: UserProfile = {
        ...validatedBody,
        id: userProfile.id,
        userId: user ? user.id : "",
        avatar: userProfile.avatar,
        name: normalizedUserName,
      };
      await this.userProfileModel.update(userProfile.id, newProfile);

      return reply.code(204).send();
    } catch (error) {
      replyErrorResponse(error, reply);
    }
  }
  async updateAvatar({ request, reply }: RouteParams) {
    try {
      await verifyAdminUser(request);

      if (!request.isMultipart) {
        throw new ClientError(
          "Requisição inválida. Precisa-se ser do tipo 'multipart/form-data'"
        );
      }

      const file = await request.file();
      const { url } = await this.userProfileService.uploadFile(file);

      const { id } = this.userProfileService.getParamId(request);
      const userProfile = await getUserProfileOrThrow(id);

      await this.userProfileModel.updateAvatar(userProfile.id, url);

      return reply.code(200).send({ imageUrl: url });
    } catch (error) {
      replyErrorResponse(error, reply);
    }
  }
}
