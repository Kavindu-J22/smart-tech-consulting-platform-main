import "server-only";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireCompany } from "@/lib/dal";
import type { Prisma } from "@/generated/prisma/client";

export async function listMarketingAssessments(companyId: string) {
  await requireCompany(companyId);
  return db.marketingAssessment.findMany({
    where: { companyId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getMarketingAssessment(companyId: string, assessmentId: string) {
  await requireCompany(companyId);
  // Matching companyId ensures an assessment ID from another company returns 404
  const assessment = await db.marketingAssessment.findFirst({
    where: { id: assessmentId, companyId },
  });
  if (!assessment) notFound();
  return assessment;
}

export async function createMarketingAssessment(
  companyId: string,
  initialAnswers: Prisma.InputJsonValue | Record<string, unknown> = {},
) {
  await requireCompany(companyId);
  return db.marketingAssessment.create({
    data: {
      companyId,
      status: "draft",
      answers: initialAnswers as Prisma.InputJsonValue,
    },
  });
}

export async function updateMarketingAssessmentAnswers(
  companyId: string,
  assessmentId: string,
  answers: Prisma.InputJsonValue | Record<string, unknown>,
) {
  await requireCompany(companyId);
  // Verify ownership before update
  const existing = await db.marketingAssessment.findFirst({
    where: { id: assessmentId, companyId },
  });
  if (!existing) notFound();

  return db.marketingAssessment.update({
    where: { id: assessmentId },
    data: { answers: answers as Prisma.InputJsonValue },
  });
}

export async function completeMarketingAssessment(
  companyId: string,
  assessmentId: string,
  answers: Prisma.InputJsonValue | Record<string, unknown>,
  report: Prisma.InputJsonValue | Record<string, unknown>,
) {
  await requireCompany(companyId);
  const existing = await db.marketingAssessment.findFirst({
    where: { id: assessmentId, companyId },
  });
  if (!existing) notFound();

  return db.marketingAssessment.update({
    where: { id: assessmentId },
    data: {
      status: "completed",
      answers: answers as Prisma.InputJsonValue,
      report: report as Prisma.InputJsonValue,
    },
  });
}

export async function deleteMarketingAssessment(companyId: string, assessmentId: string) {
  await requireCompany(companyId);
  const existing = await db.marketingAssessment.findFirst({
    where: { id: assessmentId, companyId },
  });
  if (!existing) notFound();

  return db.marketingAssessment.delete({
    where: { id: assessmentId },
  });
}
