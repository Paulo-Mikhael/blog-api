import Fastify from "fastify";
import fastifyMultipart from "@fastify/multipart";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import fastifyStatic from "@fastify/static";
import path from "node:path";
import { routes } from "./routes";
import fastifyCookie from "@fastify/cookie";

const fastify = Fastify({
  logger: true,
});

fastify.setErrorHandler((error, request, reply) => {
  reply.code(400).send({ error: error.message });
});

fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);

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
