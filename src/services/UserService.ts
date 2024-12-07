import z from "zod";
import type { User } from "@prisma/client";
import { RequestService } from "./RequestService";
import { itHas } from "../utils/itHas";
import { upperLetters } from "../data/upper_letters";
import { ClientError } from "../errors/ClientError";
import { specialCharacters } from "../data/specials_characteres";
import { numbers } from "../data/numbers";
import { UserModel } from "../models/UserModel";

type PasswordOptions = { strongPasswordValidation: boolean };

export class UserService extends RequestService {
  validate(
    body: unknown,
    passwordOptions: PasswordOptions = { strongPasswordValidation: true }
  ) {
    const userSchema = z.object({
      email: z
        .string({ message: this.requiredMessage })
        .email({ message: "Email inválido" }),
      password: z.string({ message: this.requiredMessage }),
    });

    let objectBody = {};
    if (body && typeof body === "object") {
      objectBody = body;
    }
    const validatedBody = userSchema.parse(objectBody);
    const password = validatedBody.password;
    if (passwordOptions.strongPasswordValidation) {
      if (password.length < 8) {
        throw new ClientError("A senha deve ter pelo menos 8 caracteres", 400);
      }
      if (itHas(password, upperLetters) === false) {
        throw new ClientError(
          "A senha precisa ter pelo menos uma letra maiúscula",
          400
        );
      }
      if (itHas(password, numbers) === false) {
        throw new ClientError("A senha precisa ter pelo menos um número", 406);
      }
      if (itHas(password, specialCharacters) === false) {
        throw new ClientError(
          "A senha precisa ter pelo menos um caractere especial",
          400
        );
      }
    }

    return {
      email: validatedBody.email,
      password,
    };
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

  async login(userEmail: string, passwordToValidate: string): Promise<User> {
    const userModel = new UserModel();
    const user = await userModel.getByEmailAddress(userEmail);
    const encodedPassword = this.getSafePassword(passwordToValidate);

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
