import type { FastifyRequest } from "fastify";
import type { UserModel } from "../models/UserModel";
import type { UserService } from "../services/UserService";
import type { RouteParams } from "../types/RouteParams";
import { getUserData } from "../utils/getUserData";
import { getUserOrThrow } from "../utils/getUserOrThrow";
import { replyErrorResponse } from "../utils/replyErrorResponse";
import { Controller } from "./Controller";
import { UserController } from "./UserController";
import { cookies } from "../utils/cookies";
import { ClientError } from "../errors/ClientError";

export class AdminUserController extends Controller {
  constructor(
    private readonly userModel: UserModel,
    private readonly userService: UserService
  ) {
    super();
  }

  // Método que verifica se o usuário é administrador
  private async verifyUserData(request: FastifyRequest) {
    const userData = await getUserData(request);
    const user = await this.userService.login(
      userData.username,
      userData.password
    );

    if (user.role !== "ADMIN") {
      throw new ClientError(
        `O usuário de email '${userData.username}' não é um administrador do sistema.`
      );
    }

    return userData;
  }

  async getAll({ request, reply }: RouteParams) {
    try {
      await this.verifyUserData(request);

      const { take, skip } = this.userService.getQueryTakeSkip(request.query);
      const users = await this.userModel.getAll(take, skip);

      return reply.code(200).send({ users });
    } catch (error) {
      replyErrorResponse(error, reply);
    }
  }
  async getById({ request, reply }: RouteParams) {
    try {
      await this.verifyUserData(request);

      const { id } = this.userService.getParamId(request.params);
      const requiredUser = await getUserOrThrow(id);

      return reply.code(200).send({ user: requiredUser });
    } catch (error) {
      replyErrorResponse(error, reply);
    }
  }
  async create({ request, reply }: RouteParams) {
    try {
      await this.verifyUserData(request);

      const userController = new UserController(
        this.userModel,
        this.userService
      );

      return await userController.create({ request, reply });
    } catch (error) {
      replyErrorResponse(error, reply);
    }
  }
  async delete({ request, reply }: RouteParams): Promise<undefined> {
    try {
      await this.verifyUserData(request);

      const { id } = this.userService.getParamId(request.params);
      const requiredUser = await getUserOrThrow(id);

      await this.userModel.delete(requiredUser.id);
      cookies.userEmail.remove(reply);
      cookies.sectionId.remove(reply);

      return reply.code(204);
    } catch (error) {
      replyErrorResponse(error, reply);
    }
  }
  async update({ request, reply }: RouteParams): Promise<undefined> {
    try {
      await this.verifyUserData(request);

      const { id } = this.userService.getParamId(request.params);
      const userToUpdate = await getUserOrThrow(id);

      const updateUserBody = await this.userService.validateUpdateBody(
        request.body,
        userToUpdate.email
      );
      const updatedUser = {
        id: userToUpdate.id,
        email: updateUserBody.newEmail,
        password: updateUserBody.newPassword,
      };

      await this.userModel.update(userToUpdate.id, updatedUser);

      return reply.code(204);
    } catch (error) {
      replyErrorResponse(error, reply);
    }
  }
}
