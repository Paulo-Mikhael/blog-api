import type { UserModel } from "../models/UserModel";
import type { UserService } from "../services/UserService";
import type { RouteParams } from "../types/RouteParams";
import { replyErrorResponse } from "../utils/replyErrorResponse";
import { v4 as uuidV4 } from "uuid";
import { Controller } from "./Controller";

export class UserController extends Controller {
  constructor(
    private readonly userModel: UserModel,
    private readonly userService: UserService
  ) {
    super();
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
      const requiredUser = await this.userModel.getById(id);

      return reply.code(200).send({ user: requiredUser });
    } catch (error) {
      replyErrorResponse(error, reply);
    }
  }
  async create({ request, reply }: RouteParams) {
    try {
      const validatedUserBody = this.userService.validate(request.body);
      const newUser = {
        id: uuidV4(),
        email: validatedUserBody.email,
        password: this.userService.getSafePassword(validatedUserBody.password),
      };
      const { userId } = await this.userModel.create(newUser);

      return reply.code(201).send({ userId });
    } catch (error) {
      replyErrorResponse(error, reply);
    }
  }
  async delete({ request, reply }: RouteParams) {
    try {
      const { id } = this.userService.getParamId(request.params);
      const requiredUser = await this.userModel.getById(id);

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
      await this.userModel.getById(id);

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
}
