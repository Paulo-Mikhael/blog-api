import type { FastifyReply } from "fastify";
import z from "zod";
import { ClientError } from "../errors/ClientError";
import { JsonWebTokenError } from "jsonwebtoken";
import { PrismaError } from "../errors/PrismaError";
import { ResponseSerializationError } from "fastify-type-provider-zod";
import { verifyFastifyClientError } from "./verifyFastifyClientError";

export function replyErrorResponse(error: unknown, reply: FastifyReply) {
  if (error instanceof ClientError) {
    console.error(error.stack);
    /* Caso o erro seja causado pelo cliente, 
    é retornado um erro 400 (ou derivações) junto a uma mensagem */

    return reply.code(error.statusCode).send({
      message: error.message,
    });
  }

  if (error instanceof ResponseSerializationError) {
    console.error(error.message, error.cause.issues);
    return reply.code(500).send({
      message: "Os dados recebidos não combinam com a documentação",
    });
  }

  if (error instanceof z.ZodError) {
    console.error(error.stack);

    return reply.code(400).send({
      message: "Dados inválidos",
      errors: error.errors.map((err) => ({
        property: err.path.join("."),
        error: err.message,
      })),
    });
  }

  if (error instanceof JsonWebTokenError) {
    console.error(error.stack);

    return reply.code(401).send({
      message: "Token JWT inválido",
      error: error.message,
    });
  }

  if (error instanceof PrismaError) {
    try {
      /* Caso a requisição tenha sido falha por dados incorretos do cliente,
      é lançado um erro personalizado para o cliente */

      verifyFastifyClientError(error.fastifyError, error);
    } catch (error) {
      return replyErrorResponse(error, reply);
    }
    console.error(error.fastifyError.message);

    return reply.code(500).send({
      message: "Erro ao interagir com o banco de dados",
    });
  }

  if (error instanceof Error) {
    console.error(error.stack);

    if (error.name === "SyntaxError") {
      return reply.code(406).send({
        message: `Json inválido. ${error.message}`,
      });
    }

    /* Se o erro não for causado pelo usuário, 
    deve-se retornar uma mensagem genérica para o cliente */
    return reply.code(500).send({
      message: "Erro interno do servidor",
    });
  }
}
