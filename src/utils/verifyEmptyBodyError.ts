/* Função feita com base no código de erro "empty body" do fastify
https://fastify.dev/docs/latest/Reference/Errors/#fst_err_ctp_empty_json_body */

import type { FastifyError } from "fastify";
import { ClientError } from "../errors/ClientError";

export function verifyEmptyBodyError(fastifyError: FastifyError) {
  const emptyBodyErrorCode = "FST_ERR_CTP_EMPTY_JSON_BODY";

  if (fastifyError.code === emptyBodyErrorCode) {
    throw new ClientError("O corpo da requisição não pode estar vazio", 406);
  }
}
