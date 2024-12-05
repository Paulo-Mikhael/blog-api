import { ClientError } from "../errors/ClientError";
import { UserProfileModel } from "../models/UserProfileModel";

export async function getUserProfileOrThrow(
  profileId: string,
  notFindMessage?: string
) {
  const userProfileModel = new UserProfileModel();
  const profile = await userProfileModel.getById(profileId);

  if (!profile) {
    const message = notFindMessage
      ? notFindMessage
      : "Perfil de Usuário não encontrado";
    throw new ClientError(message, 404);
  }

  return profile;
}
