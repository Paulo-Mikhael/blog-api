import type { FastifyError } from "fastify";
import type { PrismaError } from "../errors/PrismaError";
import { verifyEmptyBodyError } from "./verifyEmptyBodyError";
import { verifyForeignKeyError } from "./verifyForeignKeyError";
import { verifyUniqueFieldsError } from "./verifyUniqueFieldsError";

// Dentro dessa função deve apenas ser lançados erros do tipo "ClientError"
export function verifyFastifyClientError(
  fastifyError: FastifyError,
  prismaError?: PrismaError
) {
  if (prismaError) {
    const prismaErrorOptions = prismaError.options;
    const foreignKeys = prismaErrorOptions?.foreignKeys;
    const uniqueFieldsErrorMessage =
      prismaErrorOptions?.uniqueFieldsErrorMessage;

    verifyForeignKeyError(fastifyError, foreignKeys);
    verifyUniqueFieldsError(fastifyError, uniqueFieldsErrorMessage);
  }
  verifyEmptyBodyError(fastifyError);
}
