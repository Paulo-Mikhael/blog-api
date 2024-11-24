import type { FastifyReply } from "fastify";
import z from "zod";
import { ClientError } from "../errors/ClientError";

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

  if (error instanceof ClientError) {
    // Caso o erro seja causado pelo usuário, é retornado um erro 400 (ou derivações) junto a uma mensagem
    return reply.code(error.statusCode).send({
      message: error.message,
    });
  }

  if (error instanceof Error) {
    console.error("Erro interno do servidor", error.message);

    // Se o erro não for causado pelo usuário, a função deve retornar uma mensagem genérica para o cliente
    return reply.code(500).send({
      message: "Erro interno do servidor",
    });
  }
}
