import db from "../src/db/dbConfig";

async function main() {
  const data = db.user.upsert({
    where: {
      email: "aaa@gmail.com",
    },
    update: {},
    create: {
      email: "aaa@gmail.com",
      password: "1234$",
    },
  });

  return data;
}

main()
  .then(async (data) => {
    console.log(data.id);
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
