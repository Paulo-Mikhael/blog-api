import type { FastifyZodValidation } from "../types/FastifyZodValidation";

export class FastifyZodValidationError extends Error {
  constructor(fastifyZodValidationError: FastifyZodValidation) {
    super(fastifyZodValidationError.message);
  }
}
