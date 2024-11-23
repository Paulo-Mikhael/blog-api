import type { FastifyError } from "fastify";
import { ClientError } from "../errors/ClientError";

export function verifyForeignKeyError(
  fastifyError: FastifyError,
  foreignKeyNames?: string[]
) {
  const fastifyErrorMessage = fastifyError.message;

  // Verifica se o erro está relacionado a restrições de chave estrangeira
  if (fastifyError.code === "P2003") {
    console.error("Erro de chave estrangeira:", fastifyErrorMessage);

    if (foreignKeyNames) {
      const invalidKeys = foreignKeyNames.filter((key) => {
        return fastifyErrorMessage.includes(`${key}_fkey`);
      });

      if (invalidKeys.length > 0) {
        throw new ClientError(
          `As seguintes chaves estrangeiras são inválidas: ${invalidKeys.join(", ")}`
        );
      }
    }

    // Erro genérico caso não seja encontrado algum nome de chave estrangeira
    throw new ClientError("Chave estrangeira inválida/inexistente");
  }
}
