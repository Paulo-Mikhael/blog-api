import type { FastifyRequest } from "fastify";
import { getBasicAuth } from "./getBasicAuth";
import { getUserOrThrow } from "./getUserOrThrow";
import { jsonWebToken } from "./jsonWebToken";
import { UserService } from "../services/UserService";
import { UserModel } from "../models/UserModel";

type UserData = {
  id: string;
  username: string;
  password: string;
};

export async function getUserData(request: FastifyRequest): Promise<UserData> {
  let userData: UserData;
  const userService = new UserService();

  // Retorna o email e senha informados através do Basic Auth ou token JWT
  const auth = getBasicAuth(request.headers);
  if (auth) {
    const userModel = new UserModel();
    const user = await userModel.getByEmailAddress(auth.username);

    /* Caso não ache o usuário pelo email, vai ser lançado um erro ao fazer login mais para frente,
    logo o id nunca irá ser a string vazia */
    userData = {
      id: user ? user.id : "",
      username: auth.username,
      password: auth.password,
    };
  } else {
    const { userId } = await jsonWebToken.verifyUserPayload(
      request,
      "Faça login utilizando seu email e senha ou insira um token JWT válido."
    );
    const user = await getUserOrThrow(userId);
    userData = {
      id: userId,
      username: user.email,
      password: userService.decodeSafePassword(user.password),
    };
  }

  return userData;
}
