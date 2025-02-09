import z from "zod";
import { RequestService } from "./RequestService";
import type { RequiredPropertiesObject } from "../types/RequiredPropertiesObject";

export class UserProfileService extends RequestService {
  public readonly userProfileSchemaDocs: RequiredPropertiesObject = {
    properties: {
      name: {
        type: "string",
        maxLength: 30,
      },
      biography: {
        type: "string",
        maxLength: 200,
      },
    },
    requiredProperties: ["name", "biography"],
  };

  private userProfileSchema = z.object({
    name: z
      .string({ message: this.requiredMessage })
      .min(1, { message: this.minLengthMessage() })
      .max(30, { message: this.maxLengthMessage(30) }),
    biography: z
      .string({ message: this.requiredMessage })
      .min(1, this.minLengthMessage())
      .max(200, { message: this.maxLengthMessage(200) }),
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
