import db from "../db/dbConfig";

export async function deleteUserData(id: string) {
  const user = await db.user.findUnique({ where: { id } });
  if (!user) return;

  await db.userProfile.deleteMany({ where: { userId: user.id } });
  await db.user.deleteMany({ where: { id: user.id } });
}
