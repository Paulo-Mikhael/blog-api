import fastifyCookie from "@fastify/cookie";
import fastifyMultipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import type { FastifyPluginAsync } from "fastify";
import path from "node:path";

export const fileSize = 1570000;

export const fastifyServices: FastifyPluginAsync = async (fastify) => {
  const staticFilesConfig = {
    root: path.join(__dirname, "../../uploads"),
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
};
