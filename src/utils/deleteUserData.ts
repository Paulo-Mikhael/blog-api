import db from "../db/dbConfig";

export async function deleteUserData(id: string) {
  const user = await db.user.findUnique({ where: { id } });
  const userProfile = await db.userProfile.findUnique({
    where: { userId: id },
  });
  if (!user) return;

  if (userProfile) {
    await db.post.deleteMany({ where: { authorId: userProfile.id } });
    await db.userProfile.deleteMany({ where: { userId: user.id } });
  }
  await db.user.deleteMany({ where: { id: user.id } });
}
