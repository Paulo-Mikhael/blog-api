import { userProfileReturnSchema } from "../docs/components/userProfileReturnSchema";
import { userReturnSchema } from "../docs/components/userReturnSchema";
import { validationErrorSchema } from "../docs/schemas/validationErrorSchema";
import { UserProfileService } from "../services/UserProfileService";
import { UserService } from "../services/UserService";

export function schemaDocs() {
  const userService = new UserService();
  const userProfileService = new UserProfileService();

  return {
    user: userReturnSchema,
    userProfile: userProfileReturnSchema,
    createUser: userService.userSchema,
    createProfile: userProfileService.userProfileSchema,
    validationError: validationErrorSchema,
  };
}
