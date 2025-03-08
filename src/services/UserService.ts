import z from "zod";
import type { User } from "@prisma/client";
import { RequestService } from "./RequestService";
import { itHas } from "../utils/itHas";
import { upperLetters } from "../data/upper_letters";
import { ClientError } from "../errors/ClientError";
import { specialCharacters } from "../data/specials_characteres";
import { numbers } from "../data/numbers";
import { UserModel } from "../models/UserModel";
import type { RequiredPropertiesObject } from "../types/RequiredPropertiesObject";

type BodyOptions = {
  strongPasswordValidation?: boolean;
};

export class UserService extends RequestService {
  public readonly userSchemaDocs: RequiredPropertiesObject = {
    properties: {
      email: {
        type: "string",
        format: "email",
      },
      password: {
        type: "string",
        example: "Ex@mple123",
      },
    },
    requiredProperties: ["email", "password"],
  };
  public readonly updateUserSchemaDocs: RequiredPropertiesObject = {
    properties: {
      newEmail: {
        type: "string",
        format: "email",
      },
      oldPassword: {
        type: "string",
      },
      newPassword: {
        type: "string",
        example: "Ex@mple123",
      },
    },
    requiredProperties: ["email", "oldPassword", "newPassword"],
  };

  private userSchema = z.object({
    email: z
      .string({ message: this.requiredMessage })
      .email({ message: "Email inválido" }),
    password: z.string({ message: this.requiredMessage }),
  });
  private updateUserSchema = z.object({
    newEmail: z
      .string({ message: this.requiredMessage })
      .email({ message: "Email inválido" }),
    oldPassword: z.string({ message: this.requiredMessage }),
    newPassword: z.string({ message: this.requiredMessage }),
  });

  validate(
    body: unknown,
    bodyOptions: BodyOptions = {
      strongPasswordValidation: true,
    }
  ) {
    let objectBody = {};
    if (body && typeof body === "object") {
      objectBody = body;
    }

    const validatedBody = this.userSchema.parse(objectBody);

    if (bodyOptions.strongPasswordValidation) {
      this.verifyStrongPassword(validatedBody.password);
    }

    return validatedBody;
  }
  async validateUpdateBody(body: unknown, userActualEmail: string) {
    let objectBody = {};
    if (body && typeof body === "object") {
      objectBody = body;
    }

    const validatedUpdateUserBody = this.updateUserSchema.parse(objectBody);
    const bodyOldPassword = validatedUpdateUserBody.oldPassword;
    const bodyNewPassword = validatedUpdateUserBody.newPassword;

    await this.login(userActualEmail, bodyOldPassword);
    this.verifyStrongPassword(bodyNewPassword);

    return validatedUpdateUserBody;
  }

  public verifyStrongPassword(password: string) {
    if (password.length < 8) {
      throw new ClientError("A senha deve ter pelo menos 8 caracteres", 406);
    }
    if (itHas(password, upperLetters) === false) {
      throw new ClientError(
        "A senha precisa ter pelo menos uma letra maiúscula",
        406
      );
    }
    if (itHas(password, numbers) === false) {
      throw new ClientError("A senha precisa ter pelo menos um número", 406);
    }
    if (itHas(password, specialCharacters) === false) {
      throw new ClientError(
        "A senha precisa ter pelo menos um caractere especial",
        406
      );
    }
  }

  getSafePassword(password: string): string {
    try {
      const base64Password = Buffer.from(password).toString("base64");

      return base64Password;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  decodeSafePassword(safePassword: string): string {
    try {
      const decodedBase64Password = Buffer.from(
        safePassword,
        "base64"
      ).toString("utf-8");

      return decodedBase64Password;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async login(userEmail: string, passwordToVerify: string): Promise<User> {
    const userModel = new UserModel();
    const user = await userModel.getByEmailAddress(userEmail);
    const encodedPassword = this.getSafePassword(passwordToVerify);

    if (!user) {
      throw new ClientError(
        "Usuário com o email fornecido não foi encontrado",
        401
      );
    }

    if (user.password !== encodedPassword) {
      throw new ClientError("Senha incorreta", 401);
    }

    return user;
  }
}
