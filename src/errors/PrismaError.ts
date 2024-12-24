import type { FastifyError as FE } from "fastify";

interface PrismaErrorOptions {
  foreignKeys?: string[];
  uniqueFieldsErrorMessage?: string;
}

export class PrismaError extends Error {
  fastifyError: FE;
  options: PrismaErrorOptions | undefined;

  constructor(fastifyError: FE, options?: PrismaErrorOptions) {
    super("Prisma Error");
    this.fastifyError = fastifyError;
    this.options = options;
  }
}
