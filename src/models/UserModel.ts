import type { User } from "@prisma/client";
import type { FastifyError as FE } from "fastify";
import db from "../db/dbConfig";
import { ClientError } from "../errors/ClientError";
import { deleteUserData } from "../utils/deleteUserData";
import { Model } from "./Model";
import { FastifyError } from "../errors/FastifyError";

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
    const createdUser = await db.user
      .create({ data: user })
      .catch((error: FE) => {
        throw new FastifyError(error, {
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
        throw new FastifyError(error, {
          uniqueFieldsErrorMessage: "O e-mail fornecido já está em uso",
        });
      });

    return;
  }
  async getByEmailAddress(email: string) {
    const user = await db.user.findUnique({ where: { email } });

    if (!user) {
      throw new ClientError(
        "Usuário com o email fornecido não foi encontrado",
        400
      );
    }

    return user;
  }
}
