import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { PostRoutes } from "./PostRoutes";

export function routes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  const fastifyZod = fastify.withTypeProvider<ZodTypeProvider>();

  fastifyZod.register(PostRoutes);
}
