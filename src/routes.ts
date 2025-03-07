import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { postRoutes } from "./routes/postRoutes";
import { userRoutes } from "./routes/userRoutes";
import { userProfileRoutes } from "./routes/userProfileRoutes";
import { adminUserRoutes } from "./routes/adminUserRoutes";
import { adminPostRoutes } from "./routes/adminPostRoutes";
import { adminUserProfileRoutes } from "./routes/adminUserProfileRoutes";

export function routes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  // Rota padrão (308 permanent redirect)
  fastify.get("/", (request, reply) => {
    return reply.code(308).redirect("/docs");
  });

  fastify.register(postRoutes);
  fastify.register(userRoutes);
  fastify.register(userProfileRoutes);
  fastify.register(adminUserRoutes);
  fastify.register(adminPostRoutes);
  fastify.register(adminUserProfileRoutes);
}
