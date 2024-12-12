import type z from "zod";

type SchemaResponse = {
  [statusCode: number | string]: z.ZodObject<z.ZodRawShape>;
};
type SchemaBody = z.ZodObject<z.ZodRawShape>;
type SchemaSecurity = readonly { [securityLabel: string]: readonly string[] }[];

export type Schema = {
  summary: string;
  description: string;
  tags: string[];
  response?: SchemaResponse;
  body?: SchemaBody;
  security?: SchemaSecurity;
};
