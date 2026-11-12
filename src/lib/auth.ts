import "server-only";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "@/lib/db";

export const auth = betterAuth({
  database: prismaAdapter(db, { provider: "postgresql" }),
  emailAndPassword: { enabled: true },
  user: {
    additionalFields: {
      // input: false, so nobody can choose their own role at sign-up. Admins are made with `npm run make-admin`.
      role: { type: "string", defaultValue: "founder", input: false },
    },
  },
});
