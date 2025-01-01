import Fastify from "fastify";
import { routes } from "./routes";
import { verifyFastifyClientError } from "./utils/verifyFastifyClientError";
import { replyErrorResponse } from "./utils/replyErrorResponse";
import { swagger } from "./utils/fastifySwagger";
import { fastifyServices, fileSize } from "./utils/fastifyServices";
import path from "node:path";
import fastifyCookie from "@fastify/cookie";
import fastifyMultipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";

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

// Swagger
fastify.register(swagger);

const staticFilesConfig = {
  root: path.join(__dirname, "../uploads"),
  prefix: "/images/",
};
const multipartFilesConfig = {
  limits: { fileSize },
  attachFieldsToBody: true,
};

// Servindo arquivos estáticos
fastify.register(fastifyStatic, staticFilesConfig);
// Lidando com requisições "multipart/form-data"
fastify.register(fastifyMultipart, multipartFilesConfig);
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
