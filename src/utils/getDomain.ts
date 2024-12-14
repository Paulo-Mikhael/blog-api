import type { FastifyRequest } from "fastify";

export function getDomain(request: FastifyRequest) {
  const domain = `${request.protocol}://${request.host}`;
  return domain;
}
