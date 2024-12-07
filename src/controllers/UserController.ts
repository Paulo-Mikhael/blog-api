import type { UserService } from "../services/UserService";
import type { RouteParams } from "../types/RouteParams";
import type { UserModel } from "../models/UserModel";
import type { UserProfileService } from "../services/UserProfileService";
import { UserProfileModel } from "../models/UserProfileModel";
import { UserProfileController } from "./UserProfileController";
import { replyErrorResponse } from "../utils/replyErrorResponse";
import { v4 as uuidV4 } from "uuid";
import { Controller } from "./Controller";
import { jsonWebToken } from "../utils/jsonWebToken";
import { getUserOrThrow } from "../utils/getUserOrThrow";
import { ClientError } from "../errors/ClientError";

export class UserController extends Controller {
  private readonly userProfileController: UserProfileController;

  constructor(
    private readonly userModel: UserModel,
    private readonly userService: UserService,
    userProfileModel: UserProfileModel,
    userProfileService: UserProfileService
  ) {
    super();
    this.userProfileController = new UserProfileController(
      userProfileModel,
      userProfileService
    );
  }

  async getAll({ request, reply }: RouteParams) {
    try {
      const { take, skip } = this.userService.getQueryTakeSkip(request.query);
      const users = await this.userModel.getAll(take, skip);

      return reply.code(200).send({ users });
    } catch (error) {
      replyErrorResponse(error, reply);
    }
  }
  async getById({ request, reply }: RouteParams) {
    try {
      const { id } = this.userService.getParamId(request.params);
      const requiredUser = await getUserOrThrow(id);

      return reply.code(200).send({ user: requiredUser });
    } catch (error) {
      replyErrorResponse(error, reply);
    }
  }
  async create({ request, reply }: RouteParams) {
    try {
      const validatedBody = this.userService.validate(request.body);
      const newUser = {
        id: uuidV4(),
        email: validatedBody.email,
        password: this.userService.getSafePassword(validatedBody.password),
      };
      const { user } = await this.userModel.create(newUser);
      const userPayload = { userId: user.id };
      const { token } = jsonWebToken.create(userPayload);

      return reply.code(201).send({ jwtToken: token });
    } catch (error) {
      replyErrorResponse(error, reply);
    }
  }
  async delete({ request, reply }: RouteParams) {
    try {
      const { id } = this.userService.getParamId(request.params);
      const requiredUser = await getUserOrThrow(id);

      await this.userModel.delete(requiredUser.id);

      return reply.code(204).send();
    } catch (error) {
      replyErrorResponse(error, reply);
    }
  }
  async update({ request, reply }: RouteParams) {
    try {
      const { id } = this.userService.getParamId(request.params);
      const validatedUserBody = this.userService.validate(request.body);
      await getUserOrThrow(id);

      const newUser = {
        id,
        email: validatedUserBody.email,
        password: this.userService.getSafePassword(validatedUserBody.password),
      };

      await this.userModel.update(id, newUser);

      return reply.code(204).send();
    } catch (error) {
      replyErrorResponse(error, reply);
    }
  }
  async getActualUser({ request, reply }: RouteParams) {
    try {
      const { userId } = jsonWebToken.verify(request.headers.authorization);

      const user = await getUserOrThrow(userId);

      return reply.code(200).send({ user });
    } catch (error) {
      replyErrorResponse(error, reply);
    }
  }
  async login({ request, reply }: RouteParams) {
    try {
      const validatedBody = this.userService.validate(request.body, {
        strongPasswordValidation: false,
      });
      const user = await this.userService.login(
        validatedBody.email,
        validatedBody.password
      );

      const userPayload = {
        userId: user.id,
      };
      const { token } = jsonWebToken.create(userPayload);

      return token;
    } catch (error) {
      replyErrorResponse(error, reply);
    }
  }
  async createProfile({ request, reply }: RouteParams) {
    try {
      const { id } = await this.userService.getParamId(request.params);
      const user = await getUserOrThrow(id);
      const userProfile = user.profile;
      if (userProfile) {
        throw new ClientError(
          `Esse usuário já tem um perfil chamado: ${userProfile.name}`,
          409
        );
      }

      // Adicionando o ID de usuário especificado na requisição
      if (typeof request.body === "object") {
        request.body = {
          ...request.body,
          userId: id,
        };
      }

      return this.userProfileController.create({ request, reply });
    } catch (error) {
      replyErrorResponse(error, reply);
    }
  }
  async getByProfileName({ request, reply }: RouteParams) {
    try {
      const params = this.userService.getObjectFromRequest(request.params, [
        "name",
      ]);
      const userProfileName = params.name;

      const userProfileModel = new UserProfileModel();
      const userProfile = await userProfileModel.getByField({
        field: "name",
        value: userProfileName,
      });
      if (userProfile.length <= 0) {
        throw new ClientError("Perfil de Usuário não encontrado", 404);
      }

      const userId = userProfile[0].userId;
      const user = await this.userModel.getById(userId);

      return reply.code(200).send({ user });
    } catch (error) {
      replyErrorResponse(error, reply);
    }
  }
}
