import type { OpenAPIV3 } from "../../node_modules/openapi-types/dist/index.d.ts";

export type PropertiesObject = {
  [name: string]: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject;
};
