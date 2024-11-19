import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { PostController } from "../controllers/PostController";

export const PostRoutes: FastifyPluginAsyncZod = async (app) => {
  const post = new PostController();

  app.get("/posts", (request, reply) => post.getAll({ request, reply }));
  app.post("/create-post", (request, reply) => post.create({ request, reply }));
};
