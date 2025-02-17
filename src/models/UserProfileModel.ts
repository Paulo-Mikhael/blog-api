import type { UserProfile } from "@prisma/client";
import type { FieldParams } from "../types/FieldParams";
import type { FastifyError as FE } from "fastify";
import { Model } from "./Model";
import db from "../db/dbConfig";
import { PrismaError } from "../errors/PrismaError";
import { returnSafeProfiles } from "../utils/returnSafeProfiles";
import { returnSafeProfile } from "../utils/returnSafeProfile";

export class UserProfileModel extends Model<UserProfile> {
  async getAll(take = 50, skip = 0) {
    const profiles = await db.userProfile.findMany({
      select: {
        id: true,
        name: true,
        biography: true,
        avatar: true,
        User: {
          select: { email: true },
        },
      },
      take,
      skip,
    });
    const safeProfiles = returnSafeProfiles(profiles);

    return safeProfiles;
  }
  async getById(id: string) {
    const profile = await db.userProfile.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        biography: true,
        avatar: true,
        User: {
          select: { email: true },
        },
      },
    });

    if (profile) {
      const safeProfile = returnSafeProfile(profile);

      return safeProfile;
    }

    return null;
  }
  async getByField(fieldParams: FieldParams<UserProfile>, take = 50, skip = 0) {
    const profiles = await db.userProfile.findMany({
      where: { [fieldParams.field]: fieldParams.value },
      select: {
        id: true,
        name: true,
        biography: true,
        avatar: true,
        User: {
          select: { email: true },
        },
      },
      take,
      skip,
    });

    if (profiles.length > 0) {
      return returnSafeProfiles(profiles);
    }

    return [];
  }
  async create(
    userProfile: UserProfile
  ): Promise<{ userProfile: UserProfile }> {
    const createdProfile = await db.userProfile
      .create({ data: userProfile })
      .catch((error: FE) => {
        throw new PrismaError(error, {
          foreignKeys: ["userId"],
          uniqueFieldsErrorMessage: "Esse nome de usuário já existe",
        });
      });

    return { userProfile: createdProfile };
  }
  async delete(id: string) {
    await db.userProfile.delete({ where: { id } });

    return;
  }
  async update(id: string, newProfile: UserProfile) {
    await db.userProfile
      .update({ where: { id }, data: newProfile })
      .catch((error: FE) => {
        throw new PrismaError(error, {
          foreignKeys: ["userId"],
          uniqueFieldsErrorMessage: "Esse nome de usuário já existe",
        });
      });

    return;
  }
  async updateAvatar(id: string, avatarUrl: string) {
    await db.userProfile.update({ where: { id }, data: { avatar: avatarUrl } });
  }
}
