import type { UserService } from "../services/UserService";
import type { RouteParams } from "../types/RouteParams";
import type { UserModel } from "../models/UserModel";
import type { UserTokenPayload } from "../types/UserTokenPayload";
import { replyErrorResponse } from "../utils/replyErrorResponse";
import { v4 as uuidV4 } from "uuid";
import { jsonWebToken } from "../utils/jsonWebToken";
import { getUserOrThrow } from "../utils/getUserOrThrow";
import { ClientError } from "../errors/ClientError";
import { cookies } from "../utils/cookies";
import { getUserProfileOrThrow } from "../utils/getUserProfileOrThrow";
import { PostModel } from "../models/PostModel";
import { sendEmail } from "../utils/sendEmail";
import { getSafeString } from "../utils/getSafeString";
import z from "zod";

abstract class BaseController {
  abstract create({ request, reply }: RouteParams): Promise<undefined>;
  abstract delete({ request, reply }: RouteParams): Promise<undefined>;
  abstract update({ request, reply }: RouteParams): Promise<undefined>;
}

export class UserController extends BaseController {
  constructor(
    private readonly userModel: UserModel,
    private readonly userService: UserService
  ) {
    super();
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
      const sectionId = uuidV4();
      const userPayload: UserTokenPayload = {
        userId: user.id,
        sectionId,
      };
      const { token } = jsonWebToken.create(userPayload);

      cookies.userEmail.set(reply, user.email);
      cookies.sectionId.set(reply, sectionId);
      return reply.code(201).send({ jwtToken: token });
    } catch (error) {
      replyErrorResponse(error, reply);
    }
  }
  async delete({ request, reply }: RouteParams) {
    try {
      const { userId } = await jsonWebToken.verify(request);
      const requiredUser = await getUserOrThrow(userId);

      await this.userModel.delete(requiredUser.id);

      cookies.userEmail.remove(reply);
      cookies.sectionId.remove(reply);
      return reply.code(204);
    } catch (error) {
      replyErrorResponse(error, reply);
    }
  }
  async update({ request, reply }: RouteParams) {
    try {
      const { userId } = await jsonWebToken.verify(request);
      const user = await getUserOrThrow(userId);
      const validatedUserBody = await this.userService.validateUpdateBody(
        request.body,
        user.email
      );

      const newUser = {
        id: user.id,
        email: validatedUserBody.newEmail,
        password: this.userService.getSafePassword(
          validatedUserBody.newPassword
        ),
      };

      await this.userModel.update(user.id, newUser);
      cookies.userEmail.set(reply, newUser.email);

      return reply.code(204);
    } catch (error) {
      replyErrorResponse(error, reply);
    }
  }
  async getActualUser({ request, reply }: RouteParams) {
    try {
      const { userEmail } = cookies.get(request);
      const user = await this.userModel.getByEmailAddress(userEmail);

      // Se entrar neste bloco é erro do servidor, porque os cookies devem retornar um usuário com um email que existe
      if (!user) {
        throw new Error(
          `Ocorreu um erro ao pegar o usuário de email ${userEmail}`
        );
      }
      const userProfileId = user.profile?.id;
      if (!userProfileId) {
        return reply.code(200).send({ userEmail });
      }
      const userProfile = await getUserProfileOrThrow(userProfileId);

      return reply.code(200).send({ userProfile });
    } catch (error) {
      replyErrorResponse(error, reply);
    }
  }
  async login({ request, reply }: RouteParams) {
    try {
      const validatedBody = this.userService.validate(request.body, {
        strongPasswordValidation: false,
      });

      const bodyEmail = validatedBody.email;
      jsonWebToken.verifyExistentUser(request, bodyEmail);

      const user = await this.userService.login(
        bodyEmail,
        validatedBody.password
      );
      const sectionId = uuidV4();
      const userPayload: UserTokenPayload = {
        userId: user.id,
        sectionId,
      };
      const { token } = jsonWebToken.create(userPayload);

      cookies.userEmail.set(reply, user.email);
      cookies.sectionId.set(reply, sectionId);
      return reply.send({ jwtToken: token });
    } catch (error) {
      replyErrorResponse(error, reply);
    }
  }
  async logoff({ reply }: RouteParams) {
    try {
      cookies.userEmail.remove(reply);

      return reply.code(204).send();
    } catch (error) {
      replyErrorResponse(error, reply);
    }
  }
  async relogin({ request, reply }: RouteParams) {
    try {
      const { userEmail } = cookies.get(request);
      const user = await this.userModel.getByEmailAddress(userEmail);
      if (!user) {
        throw new ClientError("Usuário não encontrado");
      }

      const sectionId = uuidV4();
      const userPayload: UserTokenPayload = {
        userId: user.id,
        sectionId,
      };

      cookies.userEmail.set(reply, userEmail);
      cookies.sectionId.set(reply, sectionId);
      const { token } = jsonWebToken.create(userPayload);

      return reply.code(200).send({ jwtToken: token });
    } catch (error) {
      replyErrorResponse(error, reply);
    }
  }
  async getPosts({ request, reply }: RouteParams) {
    const { userEmail } = cookies.get(request);
    const user = await this.userModel.getByEmailAddress(userEmail);
    if (!user) {
      throw new Error(
        `Ocorreu um erro ao pegar o usuário de email ${userEmail}`
      );
    }

    const userProfile = user.profile;
    if (!userProfile) {
      throw new ClientError(
        "Perfil de usuário inexistente. O usuário precisa ter um perfil para criar posts."
      );
    }

    const postModel = new PostModel();
    const userPosts = await postModel.getByField({
      field: "authorId",
      value: userProfile.id,
    });

    return reply.code(200).send({ userPosts });
  }
  async sendRecuperationEmail({ request, reply }: RouteParams) {
    try {
      const { userId } = await jsonWebToken.verify(request);
      const code = Math.floor(100000 + Math.random() * 900000);
      const criptoCode = getSafeString(code.toString());
      console.log(`Código enviado: ${code}`);

      cookies.passCode.set(reply, criptoCode);

      await sendEmail(userId, code);

      return reply.code(200).send({
        message:
          "Email com código de recuperação de senha enviado. Expira em 5 minutos.",
      });
    } catch (error) {
      replyErrorResponse(error, reply);
    }
  }
  async sendRecuperationCode({ request, reply }: RouteParams) {
    try {
      const bodySchema = z.object({
        recuperationCode: z.string({
          message: "Insira o código de recuperação",
        }),
      });
      const body = bodySchema.parse(request.body);
      const bodyCode = body.recuperationCode;
      const sentCode = cookies.get(request).passCode;

      if (!sentCode) {
        throw new ClientError("Código expirado ou não enviado.");
      }
      console.log(`Código pego: ${sentCode}`);

      if (bodyCode === sentCode) {
        cookies.passCode.remove(reply);

        return reply.code(200).send({ message: "Verificado. Código correto." });
      }

      return reply.code(401).send({ message: "Código incorreto" });
    } catch (error) {
      replyErrorResponse(error, reply);
    }
  }
}
