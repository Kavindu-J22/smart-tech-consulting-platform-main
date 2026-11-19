import { z } from "zod";
import {
  AGE_GROUPS,
  AHP_CRITERIA,
  AUDIENCE_LOCATIONS,
  BUDGET_FLEXIBILITIES,
  CAMPAIGN_DURATIONS,
  CAMPAIGN_GOALS,
  CONTENT_TYPES,
  CUSTOMER_PAIN_POINTS,
  CUSTOMER_ROLES,
  LITERACY_TIERS,
  MARKET_TYPES,
  MARKETING_CHANNELS,
  MARKETING_INDUSTRIES,
  MESSAGE_DETAIL_PREFERENCES,
  TECH_COMFORT_LEVELS,
  TECH_TERMS_FAMILIARITY,
} from "./options";

// Common text validators
const requiredText = (label: string, min = 2, max = 2000) =>
  z
    .string({ error: `Please provide ${label.toLowerCase()}` })
    .trim()
    .min(min, `${label} must be at least ${min} characters`)
    .max(max, `${label} must be under ${max} characters`);

// Questionnaire answers base schema (Q1-Q21)
export const MarketingAnswersBaseSchema = z.object({
  // Section A - Product Information (Q1–Q4)
  productName: requiredText("Product or service name", 2, 100),
  productDescription: requiredText("Product description", 10, 3000),
  mainFeatures: requiredText("Main product features", 5, 2000),
  industry: z.enum(MARKETING_INDUSTRIES, { error: "Select an industry" }),

  // Section B - Target Customer Information (Q5–Q9)
  primaryTargetCustomer: requiredText("Primary target customer description", 5, 1000),
  marketType: z.enum(MARKET_TYPES, { error: "Select target market type" }),
  ageGroup: z.enum(AGE_GROUPS, { error: "Select representative age group" }).optional().nullable(),
  customerRole: z.enum(CUSTOMER_ROLES, { error: "Select customer role" }),
  audienceLocation: z.enum(AUDIENCE_LOCATIONS, { error: "Select geographic location" }),

  // Section C - Technical Literacy & Communication (Q10–Q12)
  techComfort: z.enum(TECH_COMFORT_LEVELS, { error: "Select technology comfort level" }),
  techTermsFamiliarity: z.enum(TECH_TERMS_FAMILIARITY, {
    error: "Select technical terms familiarity",
  }),
  messageDetailPreference: z.enum(MESSAGE_DETAIL_PREFERENCES, {
    error: "Select desired message detail level",
  }),
  targetAudienceLiteracyOverride: z.enum(LITERACY_TIERS).optional().nullable(),

  // Section D - Value & Channels (Q13–Q17)
  keyCustomerBenefit: requiredText("Main customer benefit", 5, 1500),
  customerPainPoints: z
    .array(z.enum(CUSTOMER_PAIN_POINTS))
    .min(1, "Select at least one customer pain point"),
  channelsCurrentlyUsed: z.array(z.enum(MARKETING_CHANNELS)),
  channelsWorkingBest: z.array(z.enum(MARKETING_CHANNELS)),
  preferredContent: z
    .array(z.enum(CONTENT_TYPES))
    .min(1, "Select at least one preferred content type"),

  // Section E - Budget & Campaign Goals (Q18–Q21)
  monthlyBudgetLkr: z
    .number({ error: "Enter a valid monthly budget in LKR" })
    .int("Enter whole rupees")
    .min(0, "Budget cannot be negative")
    .max(100_000_000, "Maximum budget is 100,000,000 LKR"),
  budgetFlexibility: z.enum(BUDGET_FLEXIBILITIES, { error: "Select budget flexibility" }),
  campaignDuration: z.enum(CAMPAIGN_DURATIONS, { error: "Select campaign duration" }),
  campaignGoals: z.array(z.enum(CAMPAIGN_GOALS)).min(1, "Select at least one campaign goal"),

  // Optional extensions
  reservePercentage: z.number().min(0).max(50),
  customAudienceNotes: z.string().trim().max(1000).optional(),
});

// Partial schema for draft saves
export const MarketingDraftSchema = MarketingAnswersBaseSchema.partial();
export type MarketingDraftInput = z.infer<typeof MarketingDraftSchema>;

// Full validated schema with conditional validation:
// Q7 (ageGroup) is required ONLY when marketType is "b2c". For "b2b" or "both", age targeting is not required.
export const MarketingAnswersSchema = MarketingAnswersBaseSchema.superRefine((data, ctx) => {
  if (data.marketType === "b2c" && !data.ageGroup) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Select representative customer age group for B2C consumer targeting (Q7)",
      path: ["ageGroup"],
    });
  }
});

export type MarketingAnswers = z.infer<typeof MarketingAnswersSchema>;

// Report Schemas
export const FeatureBenefitPairSchema = z.object({
  feature: z.string(),
  benefitStatement: z.string(),
  targetConcernAddressed: z.string(),
});
export type FeatureBenefitPair = z.infer<typeof FeatureBenefitPairSchema>;

export const AudienceIntelligenceReportSchema = z.object({
  literacyTier: z.enum(LITERACY_TIERS),
  questionnaireBaselineTier: z.enum(LITERACY_TIERS).optional(),
  nlpSuggestedTier: z.enum(LITERACY_TIERS).optional(),
  effectiveMessageTier: z.enum(LITERACY_TIERS).optional(),
  overriddenByUser: z.boolean().optional(),
  heuristicSignalLabel: z.string().optional(),
  probabilities: z.record(z.string(), z.number()),
  confidenceScore: z.number(),
  uncertaintyCaveat: z.string(),
  ruleBaselineTier: z.enum(LITERACY_TIERS), // kept for backward compatibility
  reasonCodes: z.array(z.string()),
  modelType: z.string(),
  isEmpiricallyValidated: z.boolean(),
});
export type AudienceIntelligenceReport = z.infer<typeof AudienceIntelligenceReportSchema>;

export const FeatureToValueReportSchema = z.object({
  featureBenefitPairs: z.array(FeatureBenefitPairSchema),
  coreValueProposition: z.string(),
  simpleMessage: z.string(),
  balancedMessage: z.string(),
  technicalMessage: z.string(),
  recommendedMessage: z.string(),
  shortHeadline: z.string(),
  socialCaption: z.string(),
  cta: z.string(),
  rationale: z.string(),
  audienceFit: z.string(),
  claimWarnings: z.array(z.string()),
  isAiGenerated: z.boolean(),
  generationModel: z.string(),
  generationSource: z.enum(["OpenAI", "Template Fallback"]).optional(),
});
export type FeatureToValueReport = z.infer<typeof FeatureToValueReportSchema>;

export const RankedChannelItemSchema = z.object({
  rank: z.number(),
  channelId: z.string(),
  channelName: z.string(),
  score: z.number(),
  isRecommended: z.boolean(),
  criterionContributions: z.record(z.string(), z.number()),
  rationale: z.string(),
  evidenceNotes: z.array(z.string()),
  reachRate: z.number(),
  costIndex: z.number(),
});
export type RankedChannelItem = z.infer<typeof RankedChannelItemSchema>;

export const AHPReportSchema = z.object({
  rankedChannels: z.array(RankedChannelItemSchema),
  criteriaWeights: z.record(z.enum(AHP_CRITERIA), z.number()),
  consistencyRatio: z.number(),
  isConsistent: z.boolean(),
  ruleBaselineChannels: z.array(z.string()),
  weightVersion: z.string(),
  isAssumedWeights: z.boolean(),
  methodDisclaimer: z.string(),
});
export type AHPReport = z.infer<typeof AHPReportSchema>;

export const ChannelAllocationDetailSchema = z.object({
  channelId: z.string(),
  channelName: z.string(),
  monthlyLkr: z.number(),
  totalCampaignLkr: z.number(),
  percentage: z.number(),
  score: z.number(),
  rationale: z.string(),
});
export type ChannelAllocationDetail = z.infer<typeof ChannelAllocationDetailSchema>;

export const BudgetReportSchema = z.object({
  monthlyBudgetLkr: z.number(),
  campaignMonths: z.number(),
  totalBudgetLkr: z.number(),
  reserveMonthlyLkr: z.number(),
  reserveTotalLkr: z.number(),
  channelAllocations: z.array(ChannelAllocationDetailSchema),
  equalSplitBaseline: z.array(ChannelAllocationDetailSchema),
  exactSumVerified: z.boolean(),
  proxyUtilityScore: z.number(),
  optimizationStatus: z.string(),
  methodDisclaimer: z.string(),
});
export type BudgetReport = z.infer<typeof BudgetReportSchema>;

export const ActionItemSchema = z.object({
  phase: z.string(),
  timeframe: z.string(),
  channel: z.string(),
  actionItem: z.string(),
  recommendedContent: z.string(),
  goal: z.string(),
});
export type ActionItem = z.infer<typeof ActionItemSchema>;

export const RetrievedEvidenceSchema = z.object({
  id: z.string(),
  title: z.string(),
  claim: z.string(),
  decisionUse: z.string().optional(),
  sourceTitle: z.string(),
  sourceUrl: z.string(),
  publisher: z.string(),
  observedPeriod: z.string(),
  caveat: z.string(),
  score: z.number().optional(),
  channelTags: z.array(z.string()).optional(),
  marketTypes: z.array(z.string()).optional(),
  campaignGoals: z.array(z.string()).optional(),
});
export type RetrievedEvidenceItem = z.infer<typeof RetrievedEvidenceSchema>;

export const MarketingReportSchema = z.object({
  audienceIntelligence: AudienceIntelligenceReportSchema,
  featureToValue: FeatureToValueReportSchema,
  channelStrategy: AHPReportSchema,
  budgetPlan: BudgetReportSchema,
  actionPlan: z.array(ActionItemSchema),
  citations: z.array(z.string()),
  retrievedEvidence: z.array(RetrievedEvidenceSchema).optional(),
  evidenceSource: z.string().optional(),
  evidenceNamespace: z.string().optional(),
  generatedAt: z.string(),
  methodologyVersion: z.string(),
});
export type MarketingReport = z.infer<typeof MarketingReportSchema>;
