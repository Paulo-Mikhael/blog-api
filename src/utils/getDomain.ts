import type { FastifyRequest } from "fastify";

export function getDomain(request: FastifyRequest) {
  // Para não dar erro por causa de certificado SSL, "request.protocol" não foi usado (precisa configurar o Fastify para usar essa informação).

  const domain = `http://${request.host}`;

  return domain;
}
