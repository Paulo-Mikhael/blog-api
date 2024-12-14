import { ClientError } from "../errors/ClientError";
import { UserModel } from "../models/UserModel";

export async function getUserOrThrow(
  userId: string | undefined,
  notFindMessage?: string
) {
  let message = "Usuário não encontrado";

  if (notFindMessage) {
    message = notFindMessage;
  }

  if (!userId) {
    throw new ClientError(message, 404);
  }

  const userModel = new UserModel();
  const user = await userModel.getById(userId);

  if (!user) {
    throw new ClientError(message, 404);
  }

  return user;
}
