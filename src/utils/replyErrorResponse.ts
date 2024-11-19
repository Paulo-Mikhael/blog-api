import type { FastifyReply } from "fastify";
import z from "zod";

export function replyErrorResponse(error: unknown, reply: FastifyReply) {
  if (error instanceof z.ZodError) {
    return reply.status(400).send({
      message: "Dados inválidos",
      errors: error.errors.map((err) => ({
        property: err.path.join("."),
        message: err.message,
      })),
    });
  }

  if (error instanceof Error) {
    return reply.code(500).send({
      message: "Erro interno do servidor",
      errorMessage: error.message,
    });
  }
}
