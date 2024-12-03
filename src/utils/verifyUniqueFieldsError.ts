import type { FastifyError } from "fastify";
import { ClientError } from "../errors/ClientError";

export function verifyUniqueFieldsError(
  fastifyError: FastifyError,
  message: string | undefined
) {
  const fastifyErrorMessage = fastifyError.message;
  const uniqueFieldError = "P2002";

  // Verifica se o erro está relacionado a um dado já existente no banco de dados e que deve ser único
  if (fastifyError.code === uniqueFieldError) {
    console.error("Erro de dados únicos:", fastifyErrorMessage);

    if (!message) {
      throw new ClientError("Alguns dados fornecidos já existem.", 409);
    }
    throw new ClientError(message, 409);
  }
}
