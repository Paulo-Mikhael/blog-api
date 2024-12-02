import type { User } from "@prisma/client";
import db from "../db/dbConfig";
import { verifyForeignKeyError } from "../utils/verifyForeignKeyError";
import { ClientError } from "../errors/ClientError";
import { deleteUserData } from "../utils/deleteUserData";
import { Model } from "./Model";

export class UserModel extends Model<User> {
  async getAll(take = 50, skip = 0) {
    const users = await db.user.findMany({
      include: { profile: true },
      take,
      skip,
    });

    return users;
  }
  async getById(id: string) {
    const requiredUser = await db.user.findUnique({
      where: { id },
      include: { profile: true },
    });

    if (!requiredUser) {
      throw new ClientError("Usuário não encontrado", 404);
    }

    return requiredUser;
  }
  async create(user: User) {
    const createdUser = await db.user.create({ data: user }).catch((error) => {
      verifyForeignKeyError(error);

      throw new Error("Erro na função create de UserModel");
    });

    return { userId: createdUser.id };
  }
  async delete(userId: string) {
    await deleteUserData(userId);

    return;
  }
  async update(userId: string, newUserData: User) {
    await db.user.update({ where: { id: userId }, data: newUserData });

    return;
  }
}
