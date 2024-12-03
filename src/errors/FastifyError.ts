import type { FastifyError as FE } from "fastify";

interface FastifyErrorOptions {
  foreignKeys?: string[];
  uniqueFieldsErrorMessage?: string;
}

export class FastifyError extends Error {
  fastifyError: FE;
  options: FastifyErrorOptions | undefined;

  constructor(fastifyError: FE, options?: FastifyErrorOptions) {
    const message = `Fastify Error Code ${fastifyError.code}`;
    super(message);
    this.fastifyError = fastifyError;
    this.options = options;
  }
}
