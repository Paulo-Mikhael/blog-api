import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { UserController } from "../controllers/UserController";
import { UserModel } from "../models/UserModel";
import { UserService } from "../services/UserService";

export const userRoutes: FastifyPluginAsyncZod = async (app) => {
  const userModel = new UserModel();
  const userService = new UserService();
  const user = new UserController(userModel, userService);

  app.get("/users", (request, reply) => user.getAll({ request, reply }));
  app.get("/users/:id", (request, reply) => user.getById({ request, reply }));
  app.post("/users/signup", (request, reply) => {
    user.create({ request, reply });
  });
  app.delete("/users/:id", (request, reply) => user.delete({ request, reply }));
  app.put("/users/:id", (request, reply) => user.update({ request, reply }));
  app.get("/users/actual", (request, reply) => {
    user.getActualUser({ request, reply });
  });
  app.post("/users/login", (request, reply) => user.login({ request, reply }));
};
