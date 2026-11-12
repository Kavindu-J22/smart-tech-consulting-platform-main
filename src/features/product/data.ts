import "server-only";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireCompany } from "@/lib/dal";
import type { StageInput } from "./schema";

export async function listProductAssessments(companyId: string) {
  await requireCompany(companyId);
  return db.productAssessment.findMany({ where: { companyId }, orderBy: { createdAt: "desc" } });
}

export async function getProductAssessment(companyId: string, assessmentId: string) {
  await requireCompany(companyId);
  // Matching the company too means an id from someone else's company is a 404, not a leak.
  const assessment = await db.productAssessment.findFirst({
    where: { id: assessmentId, companyId },
  });
  if (!assessment) notFound();
  return assessment;
}

export async function createProductAssessment(companyId: string, input: StageInput) {
  await requireCompany(companyId);
  return db.productAssessment.create({ data: { companyId, stage: input.stage } });
}
