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
import { retrieveMarketingKnowledge } from "./engine/retrieve-marketing-knowledge";
import { CAMPAIGN_DURATION_MONTHS } from "./options";
import type { Prisma } from "@/generated/prisma/client";

// In-memory per-assessment mutation lock to prevent rapid double-clicks and race conditions
const activeAnalysisLocks = new Set<string>();

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
  // Guard against concurrent executions for the same assessment
  if (activeAnalysisLocks.has(assessmentId)) {
    return {
      success: false,
      error: "An analysis is already actively computing for this assessment. Please wait a moment.",
    };
  }

  activeAnalysisLocks.add(assessmentId);

  try {
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
      targetAudienceLiteracyOverride: answers.targetAudienceLiteracyOverride,
    });

    // 2. Real Marketing Knowledge Retrieval from Pinecone (or verified local fallback)
    const retrievalResult = await retrieveMarketingKnowledge(answers);

    // 3. Feature-to-Value Message Translation (FR4) with Grounded Market Context
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
      retrievedEvidence: retrievalResult.evidence,
    });

    // 4. AHP Marketing Channel Evaluation (FR5)
    const ahpReport = evaluateAHPChannels({
      marketType: answers.marketType,
      audienceLiteracy: audienceReport.literacyTier,
      campaignGoal: answers.campaignGoals[0] || "brand_awareness",
      monthlyBudgetLkr: answers.monthlyBudgetLkr,
      audienceLocation: answers.audienceLocation,
      preferredContent: answers.preferredContent,
    });

    // 5. Constraint-Aware LKR Budget Optimization (FR6)
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

    // 6. Actionable Roadmap & Grounded Citations (FR7)
    const topChannels = ahpReport.rankedChannels.filter((c) => c.isRecommended).slice(0, 3);
    const phase3Timeframe =
      durationMonths === 1
        ? "Week 3–4"
        : durationMonths === 2
          ? "Month 2"
          : `Month 2–${durationMonths}`;

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
        timeframe: phase3Timeframe,
        channel: topChannels[2]?.channelName || "Supporting Channel",
        actionItem:
          "Rebalance channel spend according to largest-remainder allocation; capture retargeted conversions.",
        recommendedContent: "Customer testimonials & case studies",
        goal: "Customer acquisition and sales conversions",
      },
    ];

    // Build citations from real retrieved evidence records
    const citations: string[] =
      retrievalResult.evidence.length > 0
        ? retrievalResult.evidence.map(
            (e) =>
              `[${e.id}] ${e.sourceTitle} (${e.publisher}) — ${e.title}: "${e.claim}" (Observed: ${e.observedPeriod})`,
          )
        : [
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
      retrievedEvidence: retrievalResult.evidence,
      evidenceSource: retrievalResult.source,
      evidenceNamespace: retrievalResult.namespace,
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
  } finally {
    activeAnalysisLocks.delete(assessmentId);
  }
}

export async function deleteMarketingAssessmentAction(companyId: string, assessmentId: string) {
  await deleteMarketingAssessment(companyId, assessmentId);
  revalidatePath(`/companies/${companyId}/marketing`);
  redirect(`/companies/${companyId}/marketing`);
}
