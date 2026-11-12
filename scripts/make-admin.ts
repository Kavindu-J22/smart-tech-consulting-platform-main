// Usage: npm run make-admin you@email.com
// Has its own PrismaClient because lib/db.ts is server-only and can't run in a script.
import { loadEnvConfig } from "@next/env";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

loadEnvConfig(process.cwd());

// A function because tsx runs this file as CommonJS, which has no top-level await.
async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error("Usage: npm run make-admin you@email.com");
    process.exit(1);
  }

  const db = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
  });

  const user = await db.user.findUnique({ where: { email } });
  if (!user) {
    console.error(`No user with the email ${email}. Sign up first.`);
    process.exit(1);
  }

  await db.user.update({ where: { email }, data: { role: "admin" } });
  console.log(`${email} is now an admin.`);
  await db.$disconnect();
}

main();
