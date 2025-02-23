import type { UserModel } from "../models/UserModel";
import type { UserService } from "../services/UserService";
import type { RouteParams } from "../types/RouteParams";
import { getUserOrThrow } from "../utils/getUserOrThrow";
import { replyErrorResponse } from "../utils/replyErrorResponse";
import { Controller } from "./Controller";
import { UserController } from "./UserController";
import { cookies } from "../utils/cookies";
import { verifyAdminUser } from "../utils/verifyAdminUser";

export class AdminUserController extends Controller {
  constructor(
    private readonly userModel: UserModel,
    private readonly userService: UserService
  ) {
    super();
  }

  async getAll({ request, reply }: RouteParams) {
    try {
      await verifyAdminUser(request);

      const { take, skip } = this.userService.getQueryTakeSkip(request.query);
      const users = await this.userModel.getAll(take, skip);

      return reply.code(200).send({ users });
    } catch (error) {
      replyErrorResponse(error, reply);
    }
  }
  async getById({ request, reply }: RouteParams) {
    try {
      await verifyAdminUser(request);

      const { id } = this.userService.getParamId(request.params);
      const requiredUser = await getUserOrThrow(id);

      return reply.code(200).send({ user: requiredUser });
    } catch (error) {
      replyErrorResponse(error, reply);
    }
  }
  async create({ request, reply }: RouteParams) {
    try {
      await verifyAdminUser(request);

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
      await verifyAdminUser(request);

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
      await verifyAdminUser(request);

      const { id } = this.userService.getParamId(request.params);
      const userToUpdate = await getUserOrThrow(id);

      const updateUserBody = this.userService.validate(request.body);
      const updatedUser = {
        id: userToUpdate.id,
        email: updateUserBody.email,
        password: updateUserBody.password,
      };

      await this.userModel.update(userToUpdate.id, updatedUser);

      return reply.code(204);
    } catch (error) {
      replyErrorResponse(error, reply);
    }
  }
}
