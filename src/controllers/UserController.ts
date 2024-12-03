import type { UserModel } from "../models/UserModel";
import type { UserService } from "../services/UserService";
import type { RouteParams } from "../types/RouteParams";
import { replyErrorResponse } from "../utils/replyErrorResponse";
import { v4 as uuidV4 } from "uuid";
import { Controller } from "./Controller";
import { jsonWebToken } from "../utils/JsonWebToken";

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
  async getActualUser({ request, reply }: RouteParams) {
    try {
      const { userId } = jsonWebToken.verify(request.headers.authorization);

      const user = await this.userModel.getById(userId);

      return reply.code(200).send({ user });
    } catch (error) {
      replyErrorResponse(error, reply);
    }
  }
  async login({ request, reply }: RouteParams) {
    try {
      const validatedBody = this.userService.validate(request.body);
      const user = await this.userModel.getByEmailAddress(validatedBody.email);
      const userPassword = this.userService.decodeSafePassword(user.password);

      if (userPassword !== validatedBody.password) {
        return reply.code(401).send("Senha incorreta");
      }

      const userPayload = {
        userId: user.id,
      };
      const { token } = jsonWebToken.create(userPayload);

      return token;
    } catch (error) {
      replyErrorResponse(error, reply);
    }
  }
}
