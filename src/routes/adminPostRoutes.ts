import type { FastifyPluginAsync } from "fastify";
import { PostModel } from "../models/PostModel";
import { PostService } from "../services/PostService";
import { AdminPostController } from "../controllers/AdminPostController";

export const adminPostRoutes: FastifyPluginAsync = async (app) => {
  const postModel = new PostModel();
  const postService = new PostService();
  const adminPostController = new AdminPostController(postModel, postService);

  app.post("/admin/posts/:id", (request, reply) => {
    adminPostController.create({ request, reply });
  });
  app.delete("/admin/posts/:id", (request, reply) => {
    adminPostController.delete({ request, reply });
  });
  app.put("/admin/posts/:id", (request, reply) => {
    adminPostController.update({ request, reply });
  });
  app.put("/admin/post-cover/:id", (request, reply) => {
    adminPostController.updateCover({ request, reply });
  });
};
