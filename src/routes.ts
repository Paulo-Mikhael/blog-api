import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { postRoutes } from "./routes/postRoutes";
import { userRoutes } from "./routes/userRoutes";
import { userProfileRoutes } from "./routes/userProfileRoutes";

export function routes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  const fastifyZod = fastify.withTypeProvider<ZodTypeProvider>();

  fastifyZod.register(postRoutes);
  fastifyZod.register(userRoutes);
  fastifyZod.register(userProfileRoutes);
}
