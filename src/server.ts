import Fastify from "fastify";
import { routes } from "./routes";
import { verifyFastifyClientError } from "./utils/verifyFastifyClientError";
import { replyErrorResponse } from "./utils/replyErrorResponse";
import { swagger } from "./utils/fastifySwagger";
import { fastifyServices } from "./utils/fastifyServices";

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

// Serviços de requisição
fastify.register(fastifyServices);

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
