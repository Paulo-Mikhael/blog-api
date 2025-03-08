import type { FastifyPluginAsync } from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { paths } from "./paths";
import { schemas } from "../data/schemas";
import { parameters } from "./parameters";

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
            description:
              "Insira o token JWT de um usuário para autenticá-lo na aplicação.",
          },
          BasicAuth: {
            type: "http",
            scheme: "basic",
            description:
              "Para usar as rotas '/admin', caso seja adminstrador, insira seu email e senha nos campos abaixo, ou apenas faça login com seu usuário da aplicação.",
          },
          ResetPasswordAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
            description:
              "Insira o token JWT recebido após verificar o código de recuperação recebido por email.",
          },
        },
        parameters,
        schemas,
      },
      security: [
        {
          BearerAuth: [],
          BasicAuth: [],
        },
      ],
      // Se as rotas não forem declaradas em "paths" as referências de schemas não funcionam
      paths,
    },
  });

  // Swagger UI
  fastify.register(fastifySwaggerUi, { routePrefix: "/docs" });
};
