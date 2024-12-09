import type { SafeProfile } from "../types/SafeProfile";

export function returnSafeProfiles(profiles: SafeProfile[]) {
  let safeProfiles = [];
  safeProfiles = profiles.map((profile) => ({
    id: profile.id,
    name: profile.name,
    biography: profile.biography,
    avatar: profile.avatar,
    email: profile.User.email,
  }));

  return safeProfiles;
}
