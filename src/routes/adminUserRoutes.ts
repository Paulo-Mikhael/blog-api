import type { FastifyPluginAsync } from "fastify";
import { UserModel } from "../models/UserModel";
import { UserService } from "../services/UserService";
import { AdminUserController } from "../controllers/AdminUserController";

export const adminUserRoutes: FastifyPluginAsync = async (app) => {
  const userModel = new UserModel();
  const userService = new UserService();
  const adminUserController = new AdminUserController(userModel, userService);

  app.get("/admin/users", (request, reply) => {
    adminUserController.getAll({ request, reply });
  });
  app.get("/admin/users/:id", (request, reply) => {
    adminUserController.getById({ request, reply });
  });
  app.post("/admin/users", (request, reply) => {
    adminUserController.create({ request, reply });
  });
  app.delete("/admin/users/:id", (request, reply) => {
    adminUserController.delete({ request, reply });
  });
  app.put("/admin/users/:id", (request, reply) => {
    adminUserController.update({ request, reply });
  });
};
