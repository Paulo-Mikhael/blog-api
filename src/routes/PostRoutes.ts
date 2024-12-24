import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { PostController } from "../controllers/PostController";
import { PostModel } from "../models/PostModel";
import { PostService } from "../services/PostService";
import { PostDocs } from "../docs/PostDocs";

export const postRoutes: FastifyPluginAsyncZod = async (app) => {
  const postModel = new PostModel();
  const postService = new PostService();
  // Passando model e service como uma depedência do controller
  const post = new PostController(postModel, postService);
  const postDocs = new PostDocs();

  app.get("/posts", {
    schema: postDocs.getAllSchema(),
    handler: (request, reply) => post.getAll({ request, reply }),
  });
  app.get("/posts/:id", {
    schema: postDocs.getByIdSchema(),
    handler: (request, reply) => post.getById({ request, reply }),
  });
  app.post("/posts", {
    schema: postDocs.createSchema(),
    handler: (request, reply) => post.create({ request, reply }),
  });
  app.delete("/posts/:id", (request, reply) => post.delete({ request, reply }));
  app.put("/posts/:id", {
    schema: postDocs.updateSchema(),
    handler: (request, reply) => post.update({ request, reply }),
  });
  app.put("/post-cover/:id", (request, reply) => {
    post.updateCover({ request, reply });
  });
  app.get("/posts/category/:category", (request, reply) => {
    post.getPostsByCategory({ request, reply });
  });
  app.get("/posts/user/:userId", (request, reply) => {
    post.getPostsByUserId({ request, reply });
  });
};
