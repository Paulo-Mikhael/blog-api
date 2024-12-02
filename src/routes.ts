import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { postRoutes } from "./routes/postRoutes";
import { userRoutes } from "./routes/userRoutes";

export function routes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  const fastifyZod = fastify.withTypeProvider<ZodTypeProvider>();

  fastifyZod.register(postRoutes);
  fastifyZod.register(userRoutes);
}
