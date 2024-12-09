import type { SafeProfile } from "../types/SafeProfile";

export function returnSafeProfile(profile: SafeProfile) {
  const safeProfile = {
    id: profile.id,
    name: profile.name,
    biography: profile.biography,
    avatar: profile.avatar,
    email: profile.User.email,
  };

  return safeProfile;
}
