import type { FastifyReply, FastifyRequest } from "fastify";

export type RouteParams = {
  request: FastifyRequest;
  reply: FastifyReply;
};
