import type { OpenAPIV3 } from "../../node_modules/openapi-types/dist";

export type ParametersObject = {
  [parameterName: string]: OpenAPIV3.ParameterObject;
};
