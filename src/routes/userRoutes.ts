import type { FastifyPluginAsync } from "fastify";
import { UserController } from "../controllers/UserController";
import { UserModel } from "../models/UserModel";
import { UserService } from "../services/UserService";

export const userRoutes: FastifyPluginAsync = async (app) => {
  const userModel = new UserModel();
  const userService = new UserService();
  const user = new UserController(userModel, userService);

  app.get("/users/actual", (request, reply) =>
    user.getActualUser({ request, reply })
  );
  app.post("/users", (request, reply) => user.create({ request, reply }));
  app.delete("/users", (request, reply) => user.delete({ request, reply }));
  app.put("/users", (request, reply) => user.update({ request, reply }));
  app.get("/users/posts", (request, reply) =>
    user.getPosts({ request, reply })
  );
  app.post("/users/login", (request, reply) => user.login({ request, reply }));
  app.post("/users/logoff", (request, reply) =>
    user.logoff({ request, reply })
  );
  app.get("/users/relogin", (request, reply) =>
    user.relogin({ request, reply })
  );
  app.post("/users/recuperation-email", (request, reply) => {
    user.sendRecuperationEmail({ request, reply });
  });
};
