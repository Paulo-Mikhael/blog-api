import type { RequestBodyObject } from "../../types/RequestBodyObject";
import type { RequiredPropertiesObject } from "../../types/RequiredPropertiesObject";
import { PostService } from "../../services/PostService";

const postService = new PostService();
const updateFileSchema: RequiredPropertiesObject = {
  properties: {
    file: {
      type: "string",
      format: "binary", // Necessário para indicar upload de arquivo no Swagger
      description: "Imagem para upload",
    },
  },
  requiredProperties: ["file"],
};

export const requestBody = {
  createPost: bodyObject(postService.postSchemaDocs),
  updatePostCover: bodyObject(updateFileSchema, { isMultipart: true }),
};

function bodyObject(
  requiredPropertiesObject: RequiredPropertiesObject,
  options?: { isMultipart: boolean }
): RequestBodyObject {
  let contentType = "application/json";

  if (options?.isMultipart === true) contentType = "multipart/form-data";

  return {
    content: {
      [contentType]: {
        schema: {
          type: "object",
          properties: requiredPropertiesObject.properties,
          required: requiredPropertiesObject.requiredProperties,
        },
      },
    },
  };
}
