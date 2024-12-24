import type { User } from "@prisma/client";
import type { FastifyError as FE } from "fastify";
import type { FieldParams } from "../types/FieldParams";
import db from "../db/dbConfig";
import { deleteUserData } from "../utils/deleteUserData";
import { Model } from "./Model";
import { PrismaError } from "../errors/PrismaError";

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

    return requiredUser;
  }
  async getByField(fieldParams: FieldParams<User>, take = 50, skip = 0) {
    const users = db.user.findMany({
      where: { [fieldParams.field]: fieldParams.value },
      include: { profile: true },
      take,
      skip,
    });

    return users;
  }
  async create(user: User) {
    const createdUser = await db.user
      .create({ data: user })
      .catch((error: FE) => {
        throw new PrismaError(error, {
          uniqueFieldsErrorMessage: "O e-mail fornecido já está em uso",
        });
      });

    return { user: createdUser };
  }
  async delete(userId: string) {
    await deleteUserData(userId);

    return;
  }
  async update(userId: string, newUserData: User) {
    await db.user
      .update({ where: { id: userId }, data: newUserData })
      .catch((error: FE) => {
        throw new PrismaError(error, {
          uniqueFieldsErrorMessage: "O e-mail fornecido já está em uso",
        });
      });

    return;
  }
  async getByEmailAddress(email: string) {
    const user = await db.user.findUnique({
      where: { email },
      include: { profile: true },
    });

    return user;
  }
}
