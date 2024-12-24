import Fastify from "fastify";
import fastifyMultipart from "@fastify/multipart";
import {
  createJsonSchemaTransformObject,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import fastifyStatic from "@fastify/static";
import path from "node:path";
import { routes } from "./routes";
import fastifyCookie from "@fastify/cookie";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { schemaDocs } from "./utils/schemaDocs";
import { verifyFastifyClientError } from "./utils/verifyFastifyClientError";
import { replyErrorResponse } from "./utils/replyErrorResponse";

const fastify = Fastify({
  logger: true,
});

fastify.setErrorHandler((error, req, reply) => {
  try {
    verifyFastifyClientError(error);
  } catch (err) {
    replyErrorResponse(err, reply);
  }
  replyErrorResponse(error, reply);
});

fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);

// Swagger
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
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  transform: jsonSchemaTransform,
  transformObject: createJsonSchemaTransformObject({
    schemas: schemaDocs,
  }),
});
fastify.register(fastifySwaggerUi, { routePrefix: "/docs" });

// Servindo arquivos estáticos
fastify.register(fastifyStatic, {
  root: path.join(__dirname, "../uploads"),
  prefix: "/images/",
});
// Lidando com requisições "multipart/form-data"
export const fileSize = 1570000;
fastify.register(fastifyMultipart, { limits: { fileSize } });
// Lidando com cookies
fastify.register(fastifyCookie);
// Rotas
fastify.register(routes);

fastify.listen({ port: 3333 }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  } else {
    console.log(`Server ready on ${address}`);
  }
});
