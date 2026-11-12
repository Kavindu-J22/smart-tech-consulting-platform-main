"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  completeMarketingAssessment,
  createMarketingAssessment,
  deleteMarketingAssessment,
  updateMarketingAssessmentAnswers,
} from "./data";
import {
  MarketingAnswersSchema,
  MarketingDraftSchema,
  type MarketingAnswers,
  type MarketingReport,
} from "./schema";
import { classifyAudienceTechnicalLiteracy } from "./engine/classifier";
import { generateFeatureToValueMessages } from "./engine/translator";
import { evaluateAHPChannels } from "./engine/ahp";
import { optimizeMarketingBudget } from "./engine/budget";
import { CAMPAIGN_DURATION_MONTHS } from "./options";
import type { Prisma } from "@/generated/prisma/client";

export async function createMarketingAssessmentAction(companyId: string) {
  const assessment = await createMarketingAssessment(companyId, {});
  revalidatePath(`/companies/${companyId}/marketing`);
  redirect(`/companies/${companyId}/marketing/${assessment.id}`);
}

export async function saveMarketingDraftAction(
  companyId: string,
  assessmentId: string,
  rawAnswers: unknown,
) {
  const parsed = MarketingDraftSchema.safeParse(rawAnswers);
  if (!parsed.success) {
    return { success: false, error: "Invalid draft format" };
  }

  await updateMarketingAssessmentAnswers(
    companyId,
    assessmentId,
    parsed.data as Prisma.InputJsonValue,
  );
  revalidatePath(`/companies/${companyId}/marketing/${assessmentId}`);
  return { success: true };
}

export async function runMarketingAnalysisAction(
  companyId: string,
  assessmentId: string,
  rawAnswers: unknown,
) {
  const parsed = MarketingAnswersSchema.safeParse(rawAnswers);
  if (!parsed.success) {
    return {
      success: false,
      error: "Please complete all required questions before running analysis.",
      issues: parsed.error.issues,
    };
  }

  const answers: MarketingAnswers = parsed.data;

  // 1. Audience Technical Literacy Classification (FR3)
  const audienceReport = classifyAudienceTechnicalLiteracy({
    techComfort: answers.techComfort,
    techTermsFamiliarity: answers.techTermsFamiliarity,
    primaryTargetCustomer: answers.primaryTargetCustomer,
    customerRole: answers.customerRole,
    industry: answers.industry,
    marketType: answers.marketType,
  });

  // 2. Feature-to-Value Message Translation (FR4)
  const featureReport = await generateFeatureToValueMessages({
    productName: answers.productName,
    productDescription: answers.productDescription,
    mainFeatures: answers.mainFeatures,
    industry: answers.industry,
    primaryTargetCustomer: answers.primaryTargetCustomer,
    literacyTier: audienceReport.literacyTier,
    keyCustomerBenefit: answers.keyCustomerBenefit,
    customerPainPoints: answers.customerPainPoints,
    campaignGoals: answers.campaignGoals,
  });

  // 3. AHP Marketing Channel Evaluation (FR5)
  const ahpReport = evaluateAHPChannels({
    marketType: answers.marketType,
    audienceLiteracy: audienceReport.literacyTier,
    campaignGoal: answers.campaignGoals[0] || "brand_awareness",
    monthlyBudgetLkr: answers.monthlyBudgetLkr,
    audienceLocation: answers.audienceLocation,
    preferredContent: answers.preferredContent,
  });

  // 4. Constraint-Aware LKR Budget Optimization (FR6)
  const durationMonths = CAMPAIGN_DURATION_MONTHS[answers.campaignDuration] ?? 3;
  const budgetReport = optimizeMarketingBudget({
    monthlyBudgetLkr: answers.monthlyBudgetLkr,
    campaignMonths: durationMonths,
    budgetFlexibility: answers.budgetFlexibility,
    reservePercentage: answers.reservePercentage,
    channels: ahpReport.rankedChannels.map((c) => ({
      channelId: c.channelId,
      channelName: c.channelName,
      score: c.score,
      isRecommended: c.isRecommended,
    })),
  });

  // 5. Actionable Roadmap & Grounded Citations (FR7)
  const topChannels = ahpReport.rankedChannels.filter((c) => c.isRecommended).slice(0, 3);
  const actionPlan = [
    {
      phase: "Phase 1: Foundation & Setup",
      timeframe: "Week 1–2",
      channel: topChannels[0]?.channelName || "Primary Channel",
      actionItem: `Publish calibrated ${audienceReport.literacyTier}-literacy value propositions and set up tracking conversions.`,
      recommendedContent: answers.preferredContent[0]?.replace(/_/g, " ") || "Educational content",
      goal: answers.campaignGoals[0]?.replace(/_/g, " ") || "Brand awareness",
    },
    {
      phase: "Phase 2: Active Engagement Sprint",
      timeframe: "Week 3–6",
      channel: topChannels[1]?.channelName || "Secondary Channel",
      actionItem: `Execute targeted campaigns distributing '${featureReport.shortHeadline}'. Run A/B testing on ${audienceReport.literacyTier} messaging.`,
      recommendedContent: answers.preferredContent[1]?.replace(/_/g, " ") || "Product demos",
      goal: answers.campaignGoals[1]?.replace(/_/g, " ") || "Lead generation",
    },
    {
      phase: "Phase 3: Optimization & Retargeting",
      timeframe: `Month 2–${durationMonths}`,
      channel: topChannels[2]?.channelName || "Supporting Channel",
      actionItem:
        "Rebalance channel spend according to largest-remainder allocation; capture retargeted conversions.",
      recommendedContent: "Customer testimonials & case studies",
      goal: "Customer acquisition and sales conversions",
    },
  ];

  const citations = [
    "DataReportal, 'Digital 2026: Sri Lanka' — National platform reach and social media demographic distribution context.",
    "ICTA, 'National Digital Strategy 2030' — Sri Lankan SME digitization and digital technology adoption frameworks.",
    "Sri Lanka Export Development Board (EDB), 2025/2026 ICT/BPM Sector Marketing and Growth Directives.",
  ];

  const fullReport: MarketingReport = {
    audienceIntelligence: audienceReport,
    featureToValue: featureReport,
    channelStrategy: ahpReport,
    budgetPlan: budgetReport,
    actionPlan,
    citations,
    generatedAt: new Date().toISOString(),
    methodologyVersion: "Kalana-Marketing-AHP-v1.0",
  };

  await completeMarketingAssessment(
    companyId,
    assessmentId,
    answers as unknown as Prisma.InputJsonValue,
    fullReport as unknown as Prisma.InputJsonValue,
  );

  revalidatePath(`/companies/${companyId}/marketing`);
  revalidatePath(`/companies/${companyId}/marketing/${assessmentId}`);
  redirect(`/companies/${companyId}/marketing/${assessmentId}/report`);
}

export async function deleteMarketingAssessmentAction(companyId: string, assessmentId: string) {
  await deleteMarketingAssessment(companyId, assessmentId);
  revalidatePath(`/companies/${companyId}/marketing`);
  redirect(`/companies/${companyId}/marketing`);
}
