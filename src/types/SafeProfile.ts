import type { UserProfile } from "@prisma/client";

export type SafeProfile = Omit<UserProfile, "userId"> & {
  User: { email: string };
};
