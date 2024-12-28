import type { PropertiesObject } from "../../types/PropertiesObject";
import type { ResponseObject } from "../../types/ResponseObject";

export const http = {
  code200Schema: httpCodeSchema("Requisição feita com sucesso"),
  code201Schema: httpCodeSchema("Dados criados com sucesso"),
  code204Schema: httpNoContentSchema(),
  code401Schema: httpCodeSchema("Acesso negado"),
  code404Schema: HttpMessageSchema("Não encontrado", "Nada foi encontrado"),
  code409Schema: httpCodeSchema("Dados já existentes"),
  code500Schema: HttpMessageSchema("Erro interno no servidor"),
  clientErrorSchema: httpCodeSchema("Erro pelo lado do cliente"),
  validationErrorSchema: httpCodeSchema(
    "Erro de validação dos dados da requisição"
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

function HttpMessageSchema(message: string, example?: string): ResponseObject {
  const httpSchema = httpCodeSchema(message);

  let exampleMessage = message;
  if (example) exampleMessage = example;

  return httpSchema({
    message: {
      type: "string",
      example: exampleMessage,
    },
  });
}
