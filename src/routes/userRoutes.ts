import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { UserController } from "../controllers/UserController";
import { UserModel } from "../models/UserModel";
import { UserService } from "../services/UserService";
import { UserProfileModel } from "../models/UserProfileModel";
import { UserProfileService } from "../services/UserProfileService";

export const userRoutes: FastifyPluginAsyncZod = async (app) => {
  const userModel = new UserModel();
  const userService = new UserService();
  const userProfileModel = new UserProfileModel();
  const userProfileService = new UserProfileService();
  const user = new UserController(
    userModel,
    userService,
    userProfileModel,
    userProfileService
  );

  app.get("/admin/users", (request, reply) => user.getAll({ request, reply }));
  app.get("/admin/users/:id", (request, reply) =>
    user.getById({ request, reply })
  );
  app.post("/users", (request, reply) => {
    user.create({ request, reply });
  });
  app.delete("/users", (request, reply) => user.delete({ request, reply }));
  app.put("/users", (request, reply) => user.update({ request, reply }));
  app.get("/users/actual", (request, reply) => {
    user.getActualUser({ request, reply });
  });
  app.post("/users/login", (request, reply) => user.login({ request, reply }));
  app.post("/users/logoff", (request, reply) =>
    user.logoff({ request, reply })
  );
  app.post("/users/profile", (request, reply) => {
    user.createProfile({ request, reply });
  });
  app.get("/users/profile/:name", (request, reply) => {
    user.getByProfileName({ request, reply });
  });
};
