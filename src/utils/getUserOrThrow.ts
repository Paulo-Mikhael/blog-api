import { ClientError } from "../errors/ClientError";
import { UserModel } from "../models/UserModel";

export async function getUserOrThrow(userId: string, notFindMessage?: string) {
  const userModel = new UserModel();
  const user = await userModel.getById(userId);

  if (!user) {
    const message = notFindMessage ? notFindMessage : "Usuário não encontrado";
    throw new ClientError(message, 404);
  }

  return user;
}
