import type { FastifyReply } from "fastify";
import z from "zod";
import { ClientError } from "../errors/ClientError";
import { JsonWebTokenError } from "jsonwebtoken";
import { FastifyError } from "../errors/FastifyError";
import { verifyForeignKeyError } from "./verifyForeignKeyError";
import { verifyUniqueFieldsError } from "./verifyUniqueFieldsError";

export function replyErrorResponse(error: unknown, reply: FastifyReply) {
  const clientError = (error: unknown) => {
    if (error instanceof ClientError) {
      console.error(error.stack);
      /* Caso o erro seja causado pelo usuário, 
      é retornado um erro 400 (ou derivações) junto a uma mensagem */
      return reply.code(error.statusCode).send({
        message: error.message,
      });
    }
  };

  clientError(error);

  if (error instanceof z.ZodError) {
    console.error(error.stack);

    return reply.status(400).send({
      message: "Dados inválidos",
      errors: error.errors.map((err) => ({
        property: err.path.join("."),
        error: err.message,
      })),
    });
  }

  if (error instanceof FastifyError) {
    console.error(error.stack);
    const foreignKeys = error.options?.foreignKeys;
    const uniqueFieldsErrorMessage = error.options?.uniqueFieldsErrorMessage;

    try {
      /* Caso a requisição tenha sido falha por dados incorretos do usuário,
      é lançado um erro personalizado para o cliente */
      verifyForeignKeyError(error.fastifyError, foreignKeys);
      verifyUniqueFieldsError(error.fastifyError, uniqueFieldsErrorMessage);
    } catch (error) {
      clientError(error);
    }

    return reply.code(500).send({
      message: "Erro ao interagir com o banco de dados",
    });
  }

  if (error instanceof JsonWebTokenError) {
    console.error(error.stack);
    const errorMessage = error.message;

    return reply.code(401).send({
      message: "Token JWT inválido",
      error: errorMessage,
    });
  }

  if (error instanceof Error) {
    console.error("Erro interno do servidor", error.message);

    /* Se o erro não for causado pelo usuário, 
    deve-se retornar uma mensagem genérica para o cliente */
    return reply.code(500).send({
      message: "Erro interno do servidor",
    });
  }
}
