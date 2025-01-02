import type { SchemaObject } from "../types/SchemaObject.js";
import { UserSchema } from "../docs/schemas/UserSchema.js";
import { UserProfileSchema } from "../docs/schemas/UserProfileSchema.js";
import { PostSchema } from "../docs/schemas/PostSchema.js";

export const schemas: SchemaObject = {
  ...UserSchema,
  ...UserProfileSchema,
  ...PostSchema,
};
