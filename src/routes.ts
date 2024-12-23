import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { postRoutes } from "./routes/postRoutes";
import { userRoutes } from "./routes/userRoutes";
import { userProfileRoutes } from "./routes/userProfileRoutes";

export function routes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  // Fastify com provider que ajuda a validar os dados
  const fastifyZod = fastify.withTypeProvider<ZodTypeProvider>();

  // Rota padrão
  fastifyZod.get("/", (request, reply) => {
    return reply.redirect("/docs");
  });

  fastifyZod.register(userRoutes);
  fastifyZod.register(userProfileRoutes);
  fastifyZod.register(postRoutes);
}
