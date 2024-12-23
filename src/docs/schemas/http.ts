import type z from "zod";

export const http = {
  code200Schema: httpCodeSchema("Requisição feita com sucesso"),
  code201Schema: httpCodeSchema("Dados criados com sucesso"),
  code204Schema: httpNoContentSchema,
  code500Schema: httpCodeSchema("Erro interno no servidor"),
  code401Schema: httpCodeSchema("Acesso negado"),
  code404Schema: httpCodeSchema("Não encontrado"),
  clientErrorSchema: httpCodeSchema("Erro pelo lado do cliente"),
  validationErrorSchema: httpCodeSchema(
    "Erro de validação dos dados da requisição"
  ),
};

type ZodObject =
  | z.ZodObject<z.ZodRawShape>
  | z.ZodDefault<z.ZodObject<z.ZodRawShape>>;

function httpCodeSchema(describeMessage: string) {
  return (zodObject: ZodObject) => {
    return zodObject.describe(describeMessage);
  };
}
function httpNoContentSchema(
  zodString: z.ZodReadonly<z.ZodDefault<z.ZodString>>
) {
  return zodString.describe(
    "Requisição feita com sucesso, nenhum conteúdo retornado"
  );
}
