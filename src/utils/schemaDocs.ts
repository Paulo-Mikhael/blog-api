import type z from "zod";
import { userProfileReturnSchema } from "../docs/components/userProfileReturnSchema";
import { userReturnSchema } from "../docs/components/userReturnSchema";
import { validationErrorSchema } from "../docs/schemas/validationErrorSchema";
import { UserProfileService } from "../services/UserProfileService";
import { UserService } from "../services/UserService";
import { postReturnSchema } from "../docs/components/postReturnSchema";

const userService = new UserService();
const userProfileService = new UserProfileService();

type SchemaDocs = {
  [componentName: string]: z.ZodObject<z.ZodRawShape>;
};

export const schemaDocs: SchemaDocs = {
  user: userReturnSchema,
  userProfile: userProfileReturnSchema,
  post: postReturnSchema,
  createUser: userService.userSchema,
  createProfile: userProfileService.userProfileSchema,
  validationError: validationErrorSchema,
};
