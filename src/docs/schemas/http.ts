import type { PropertiesObject } from "../../types/PropertiesObject";
import type { ResponseObject } from "../../types/ResponseObject";

export const http = {
  code200Schema: httpCodeSchema("Requisição feita com sucesso"),
  code201Schema: httpCodeSchema("Dados criados com sucesso"),
  code204Schema: httpNoContentSchema(),
  tokenJWTErrorSchema: httpJWTErrorSchema(
    "Acesso Negado",
    "Bearer Token inválido"
  ),
  code404Schema: httpMessageSchema("Não encontrado", "Nada foi encontrado"),
  code409Schema: httpCodeSchema("Dados já existentes"),
  code500Schema: httpMessageSchema("Erro interno no servidor"),
  clientErrorSchema: clientErrorMessageSchema(),
  validationErrorSchema: httpValidationErrorSchema(
    "Erro de validação dos dados da requisição"
  ),
  adminAcess401Error: httpMessageSchema(
    "Acesso Negado",
    "Faça login como administrador para acessar as rotas '/admin'"
  ),
};

function httpCodeSchema(
  describeMessage: string
): (schema: PropertiesObject) => ResponseObject {
  return (schemaObject: PropertiesObject) => {
    return {
      description: describeMessage,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              ...schemaObject,
            },
          },
        },
      },
    };
  };
}

function httpNoContentSchema() {
  return {
    type: "object",
    description: "Requisição feita com sucesso, nenhum conteúdo retornado",
  };
}

function httpMessageSchema(
  schemaMessage: string,
  example?: string
): ResponseObject {
  const httpSchema = httpCodeSchema(schemaMessage);

  let exampleMessage = schemaMessage;
  if (example) exampleMessage = example;

  return httpSchema({
    message: {
      type: "string",
      example: exampleMessage,
    },
  });
}
function clientErrorMessageSchema() {
  return (schemaMessage?: string, example?: string): ResponseObject => {
    let message = "Erro pelo lado do cliente";
    if (schemaMessage) message = schemaMessage;

    const httpSchema = httpCodeSchema(message);

    let exampleMessage = message;
    if (example) exampleMessage = example;

    return httpSchema({
      message: {
        type: "string",
        example: exampleMessage,
      },
    });
  };
}

function httpJWTErrorSchema(
  schemaMessage: string,
  example?: string
): ResponseObject {
  const httpSchema = httpCodeSchema(schemaMessage);

  let exampleMessage = schemaMessage;
  if (example) exampleMessage = example;

  return httpSchema({
    message: {
      type: "string",
      example: "Token JWT inválido",
    },
    error: {
      type: "string",
      example: exampleMessage,
    },
  });
}
function httpValidationErrorSchema(schemaMessage: string): ResponseObject {
  const httpSchema = httpCodeSchema(schemaMessage);

  return httpSchema({
    message: {
      type: "string",
      example: "Dados inválidos",
    },
    errors: {
      type: "array",
      items: {
        type: "object",
        properties: {
          property: {
            type: "string",
            example: "name",
          },
          error: {
            type: "string",
            example: "required",
          },
        },
      },
    },
  });
}
