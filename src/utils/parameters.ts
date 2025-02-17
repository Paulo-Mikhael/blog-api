import type { ParametersObject } from "../types/ParametersObject";

export const parameters: ParametersObject = {
  QueryTake: {
    name: "take",
    in: "query",
    required: false,
    schema: {
      type: "string",
      default: 50,
    },
  },
  QuerySkip: {
    name: "skip",
    in: "query",
    required: false,
    schema: {
      type: "string",
      default: 0,
    },
  },
  ParameterId: {
    name: "id",
    in: "path",
    required: true,
    schema: {
      type: "string",
    },
  },
  ParameterName: {
    name: "name",
    in: "path",
    required: true,
    schema: {
      type: "string",
    },
  },
};
