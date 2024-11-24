import { v4 as uuidV4 } from "uuid";
import db from "../src/db/dbConfig";
import { deleteUserData } from "../src/utils/deleteUserData";

async function main() {
  const userId = "5b067322-7aae-47d5-a0d7-8265307bbb5b";
  const postId = uuidV4();
  const userProfileId = uuidV4();

  await deleteUserData(userId);

  await db.user.upsert({
    where: {
      id: userId,
    },
    update: {},
    create: {
      id: userId,
      email: "aaa@gmail.com",
      password: "1234$",
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
      cover: "",
      authorId: userId,
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
}

main()
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => await db.$disconnect());
