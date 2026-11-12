import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// The only place that decides who may do what. Every data.ts function starts with one of these.

// cache() so a page and its layout share one session lookup per request.
export const requireUser = cache(async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");
  return session.user;
});

// cache() so a page and its generateMetadata (the tab title) share one lookup per request.
export const requireCompany = cache(async (companyId: string) => {
  const user = await requireUser();
  // Someone else's company looks the same as a missing one, so we don't reveal that it exists.
  const company = await db.company.findFirst({ where: { id: companyId, ownerId: user.id } });
  if (!company) notFound();
  return company;
});

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "admin") notFound();
  return user;
}
