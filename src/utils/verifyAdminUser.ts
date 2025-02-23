import type { FastifyRequest } from "fastify";
import { ClientError } from "../errors/ClientError";
import { getUserData } from "./getUserData";
import { UserService } from "../services/UserService";

// Método que verifica se o usuário é administrador
export async function verifyAdminUser(request: FastifyRequest) {
  const userService = new UserService();

  const userData = await getUserData(request);
  const user = await userService.login(userData.username, userData.password);

  if (user.role !== "ADMIN") {
    throw new ClientError(
      `O usuário de email '${userData.username}' não é um administrador do sistema.`
    );
  }

  return userData;
}
