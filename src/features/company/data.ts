import "server-only";
import { db } from "@/lib/db";
import { requireUser, requireCompany } from "@/lib/dal";
import type { CompanyInput } from "./schema";

export async function listCompanies() {
  const user = await requireUser();
  return db.company.findMany({ where: { ownerId: user.id }, orderBy: { createdAt: "desc" } });
}

export async function getCompany(companyId: string) {
  return requireCompany(companyId);
}

export async function createCompany(input: CompanyInput) {
  const user = await requireUser();
  return db.company.create({ data: { ...input, ownerId: user.id } });
}

export async function updateCompany(companyId: string, input: CompanyInput) {
  await requireCompany(companyId);
  await db.company.update({ where: { id: companyId }, data: input });
}

export async function deleteCompany(companyId: string) {
  await requireCompany(companyId);
  await db.company.delete({ where: { id: companyId } });
}
