import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { PostController } from "../controllers/PostController";

export const PostRoutes: FastifyPluginAsyncZod = async (app) => {
  const post = new PostController();

  app.get("/posts", (request, reply) => post.getAll({ request, reply }));
  app.get("/posts/:id", (request, reply) => post.getById({ request, reply }));
  app.post("/posts", (request, reply) => post.create({ request, reply }));
  app.delete("/posts/:id", (request, reply) => post.delete({ request, reply }));
  app.put("/posts/:id", (request, reply) => post.update({ request, reply }));
  app.post("/post-cover", (request, reply) => {
    post.updateCover({ request, reply });
  });
};
