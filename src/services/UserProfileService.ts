import z from "zod";
import { RequestService } from "./RequestService";

export class UserProfileService extends RequestService {
  public userProfileSchemaDocs = z.object({
    name: z.string().optional(),
    biography: z.string().optional(),
  });

  public userProfileSchema = z.object({
    name: z
      .string({ message: this.requiredMessage })
      .min(1, { message: this.minLengthMessage() })
      .max(30, { message: this.maxLengthMessage(30) }),
    biography: z
      .string({ message: this.requiredMessage })
      .min(1, this.minLengthMessage()),
  });

  validate(body: unknown) {
    let objectBody = {};
    if (body && typeof body === "object") {
      objectBody = body;
    }
    const validatedBodyItems = this.userProfileSchema.parse(objectBody);
    const validatedBody = {
      ...validatedBodyItems,
    };

    return validatedBody;
  }
}
