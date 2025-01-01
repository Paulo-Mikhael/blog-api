import type { RequiredPropertiesObject } from "../types/RequiredPropertiesObject";

export const updateFileSchema: RequiredPropertiesObject = {
  properties: {
    file: {
      type: "string",
      format: "binary", // Necessário para indicar upload de arquivo no Swagger
      description: "Imagem para upload",
    },
  },
  requiredProperties: ["file"],
};
