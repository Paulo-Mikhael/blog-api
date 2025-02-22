import type { FastifyRequest } from "fastify";
import { getBasicAuth } from "./getBasicAuth";
import { getUserOrThrow } from "./getUserOrThrow";
import { jsonWebToken } from "./jsonWebToken";
import { UserService } from "../services/UserService";

type UserData = {
  username: string;
  password: string;
};

export async function getUserData(request: FastifyRequest): Promise<UserData> {
  let userData: UserData;
  const userService = new UserService();

  // Loga o usuário pelo email e senha informados ou pelo token JWT informado
  const auth = getBasicAuth(request.headers);
  if (auth) {
    userData = {
      username: auth.username,
      password: auth.password,
    };
  } else {
    const { userId } = await jsonWebToken.verify(
      request,
      "Faça login utilizando seu email e senha ou insira um token JWT válido."
    );
    const user = await getUserOrThrow(userId);
    userData = {
      username: user.email,
      password: userService.decodeSafePassword(user.password),
    };
  }

  return userData;
}
