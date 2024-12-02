import z from "zod";
import { RequestService } from "./RequestService";
import { itHas } from "../utils/itHas";
import { upperLetters } from "../data/upper_letters";
import { ClientError } from "../errors/ClientError";
import { specialCharacters } from "../data/specials_characteres";
import { numbers } from "../data/numbers";

export class UserService extends RequestService {
  validate(body: unknown) {
    const userSchema = z.object({
      email: z
        .string({ message: this.requiredMessage })
        .email({ message: "Email inválido" }),
      password: z
        .string({ message: this.requiredMessage })
        .min(8, { message: "A senha deve ter pelo menos 8 caracteres" }),
    });

    const validatedBody = userSchema.parse(body);
    const password = validatedBody.password;
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
}
