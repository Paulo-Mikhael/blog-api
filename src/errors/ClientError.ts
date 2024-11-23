import type { HttpStatusCode400 } from "../types/HttpStatusCode400";

export class ClientError extends Error {
  statusCode: HttpStatusCode400;

  constructor(message: string, statusCode?: HttpStatusCode400) {
    super(message);
    this.message = message;
    this.statusCode = statusCode ? statusCode : 400;
  }
}
