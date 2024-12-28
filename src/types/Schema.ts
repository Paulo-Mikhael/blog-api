import type z from "zod";

// "Schema Response" deve ter um objeto ou uma string estática como propriedades
type SchemaResponse = {
  [statusCode: number | string]:
    | z.ZodObject<z.ZodRawShape>
    | z.ZodDefault<z.ZodObject<z.ZodRawShape>>
    | z.ZodReadonly<z.ZodDefault<z.ZodString>>;
};
type SchemaBody = z.ZodObject<z.ZodRawShape>;
type SchemaParams = z.ZodObject<z.ZodRawShape>;
type SchemaQuery = z.ZodObject<z.ZodRawShape>;
type SchemaSecurity = readonly {
  [securityLabel: string]: readonly string[];
}[];
type RequestConsume = "multipart/form-data";
type SchemaConsumes = RequestConsume[];

export type Schema = {
  summary: string;
  description?: string;
  tags: string[];
  response?: SchemaResponse;
  body?: SchemaBody;
  security?: SchemaSecurity;
  params?: SchemaParams;
  querystring?: SchemaQuery;
  consumes?: SchemaConsumes;
};
