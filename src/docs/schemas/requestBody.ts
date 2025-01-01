import type { RequestBodyObject } from "../../types/RequestBodyObject";
import type { RequiredPropertiesObject } from "../../types/RequiredPropertiesObject";
import { PostService } from "../../services/PostService";
import { updateFileSchema } from "../../data/update_file_schema";

const postService = new PostService();

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
