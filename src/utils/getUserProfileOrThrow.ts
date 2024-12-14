import { ClientError } from "../errors/ClientError";
import { UserProfileModel } from "../models/UserProfileModel";

export async function getUserProfileOrThrow(
  profileId: string | undefined,
  notFindMessage?: string
) {
  let message = "Perfil de Usuário não encontrado";

  if (notFindMessage) {
    message = notFindMessage;
  }

  if (!profileId) {
    throw new ClientError(message, 404);
  }

  const userProfileModel = new UserProfileModel();
  const profile = await userProfileModel.getById(profileId);

  if (!profile) {
    throw new ClientError(message, 404);
  }

  return profile;
}
