import db from "../src/db/dbConfig";
import { deleteUserData } from "../src/utils/deleteUserData";

async function main() {
  const userId = "5b067322-7aae-47d5-a0d7-8265307bbb5b";
  const postId = "5b067322-8are-47d5-a0d7-8265307bbb5b";
  const userProfileId = "5b067322-2ggt-47d5-a0d7-8265307bbb5b";

  // Para evitar erros
  await deleteUserData(userId);

  await db.user.upsert({
    where: {
      id: userId,
    },
    update: {},
    create: {
      id: userId,
      email: "aaa@gmail.com",
      password: Buffer.from("Uns@fe123#").toString("base64"),
      role: "ADMIN",
    },
  });

  await db.userProfile.upsert({
    where: {
      id: userProfileId,
    },
    update: {},
    create: {
      id: userProfileId,
      name: "Usuário",
      biography: "Usuário padrão da aplicação",
      avatar: "",
      userId: userId,
    },
  });

  await db.post.upsert({
    where: {
      id: postId,
    },
    update: {},
    create: {
      id: postId,
      title: "Meu primeiro post",
      category: "tutorial",
      content: "[Link para algo](https://algo)",
      slug: "meu-primeiro-post",
      cover: "https://http.cat/200",
      authorId: userProfileId,
    },
  });
}

main()
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => await db.$disconnect());
