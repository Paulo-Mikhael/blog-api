import type { FastifyPluginAsync } from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { paths } from "./paths";
import { schemas } from "../data/schemas";

export const swagger: FastifyPluginAsync = async (fastify) => {
  // Swagger formato openapi
  fastify.register(fastifySwagger, {
    openapi: {
      openapi: "3.0.0",
      info: { title: "API para blog", version: "0.0.1" },
      servers: [
        { url: "http://localhost:3333", description: "Development server" },
      ],
      externalDocs: {
        description: "Github do Projeto",
        url: "https://github.com/Paulo-Mikhael/blog-api?tab=readme-ov-file#readme",
      },
      components: {
        securitySchemes: {
          BearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
        parameters: {
          QueryTake: {
            name: "take",
            in: "query",
            required: false,
            schema: {
              type: "string",
              default: 50,
            },
          },
          QuerySkip: {
            name: "skip",
            in: "query",
            required: false,
            schema: {
              type: "string",
              default: 0,
            },
          },
          ParameterId: {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        },
        schemas,
      },
      security: [
        {
          BearerAuth: [],
        },
      ],
      // Se as rotas não forem declaradas em "paths" as referências de schemas não funcionam
      paths,
    },
  });

  // Swagger UI
  fastify.register(fastifySwaggerUi, { routePrefix: "/docs" });
};
