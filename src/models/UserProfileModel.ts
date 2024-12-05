import type { UserProfile } from "@prisma/client";
import type { FieldParams } from "../types/FieldParams";
import type { FastifyError as FE } from "fastify";
import { Model } from "./Model";
import db from "../db/dbConfig";
import { FastifyError } from "../errors/FastifyError";

export class UserProfileModel extends Model<UserProfile> {
  async getAll(take = 50, skip = 0): Promise<UserProfile[]> {
    const profiles = await db.userProfile.findMany({ take, skip });

    return profiles;
  }
  async getById(id: string): Promise<UserProfile | null> {
    const profile = await db.userProfile.findUnique({ where: { id } });

    return profile;
  }
  async getByField(
    fieldParams: FieldParams,
    take = 50,
    skip = 0
  ): Promise<UserProfile[]> {
    const profiles = await db.userProfile.findMany({
      where: { [fieldParams.field]: fieldParams.value },
      take,
      skip,
    });

    return profiles;
  }
  async create(
    userProfile: UserProfile
  ): Promise<{ userProfile: UserProfile }> {
    const createdProfile = await db.userProfile
      .create({ data: userProfile })
      .catch((error: FE) => {
        throw new FastifyError(error, {
          foreignKeys: ["userId"],
          uniqueFieldsErrorMessage:
            "O nome ou usuário especificados já existem",
        });
      });

    return { userProfile: createdProfile };
  }
  async delete(id: string) {
    await db.userProfile.delete({ where: { id } });

    return;
  }
  async update(id: string, newProfile: UserProfile) {
    await db.user.update({ where: { id }, data: newProfile });

    return;
  }
}
