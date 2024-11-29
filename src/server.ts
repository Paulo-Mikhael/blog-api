import Fastify from "fastify";
import fastifyMultipart from "@fastify/multipart";
import multer from "multer";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import fastifyStatic from "@fastify/static";
import path from "node:path";
import { routes } from "./routes";

const fastify = Fastify({
  logger: true,
});

fastify.setErrorHandler((error, request, reply) => {
  reply.code(400).send({ error: error.message });
});

fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);

fastify.register(fastifyStatic, {
  root: path.join(__dirname, "../uploads"),
  prefix: "/images/",
});
fastify.register(fastifyMultipart, {
  limits: { fileSize: 2000000 },
});
fastify.register(routes);

fastify.listen({ port: 3333 }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  } else {
    console.log(`Servidor rodando na porta ${address}`);
  }
});
