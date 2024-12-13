import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { UserController } from "../controllers/UserController";
import { UserModel } from "../models/UserModel";
import { UserService } from "../services/UserService";
import { UserProfileModel } from "../models/UserProfileModel";
import { UserProfileService } from "../services/UserProfileService";
import { UsersDocs } from "../docs/UsersDocs";

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
  const usersDocs = new UsersDocs();

  app.get("/admin/users", {
    schema: usersDocs.getAllSchema(),
    handler: async (request, reply) => user.getAll({ request, reply }),
  });

  app.get("/admin/users/:id", {
    schema: usersDocs.getByIdSchema(),
    handler: (request, reply) => user.getById({ request, reply }),
  });
  app.get("/users/actual", {
    schema: usersDocs.getActualSchema(),
    handler: (request, reply) => user.getActualUser({ request, reply }),
  });
  app.post("/users", {
    schema: usersDocs.createSchema(),
    handler: (request, reply) => user.create({ request, reply }),
  });
  app.delete("/users", {
    schema: usersDocs.deleteSchema(),
    handler: (request, reply) => user.delete({ request, reply }),
  });
  app.put("/users", {
    schema: usersDocs.updateSchema(),
    handler: (request, reply) => user.update({ request, reply }),
  });
  app.post("/users/login", {
    schema: usersDocs.loginSchema(),
    handler: (request, reply) => user.login({ request, reply }),
  });
  app.post("/users/logoff", {
    schema: usersDocs.logoffSchema(),
    handler: (request, reply) => user.logoff({ request, reply }),
  });
  app.post("/users/profile", (request, reply) => {
    user.createProfile({ request, reply });
  });
  app.get("/users/profile/:name", (request, reply) => {
    user.getByProfileName({ request, reply });
  });
};
