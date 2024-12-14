import z from "zod";
import { RequestService } from "./RequestService";

export class UserProfileService extends RequestService {
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
    const validatedBody = {
      ...this.userProfileSchema.parse(objectBody),
    };

    return validatedBody;
  }
}
