import { z } from "zod";
import {
  ADOPTION_BARRIERS,
  BUILD_STAGES,
  CHURN_FREQUENCIES,
  COMPETITION_LEVELS,
  COMPETITOR_PREFERENCES,
  CONFIDENCE_LEVELS,
  CUSTOMER_CONVERSATIONS,
  FEEDBACK_SPEEDS,
  LAUNCH_CONCERNS,
  MARKET_CHANGES,
  PAYMENT_RESEARCH,
  PERFORMANCE_PROBLEMS,
  PRIORITIES,
  PRODUCT_STAGES,
  RISK_LEVELS,
  TARGET_CUSTOMERS,
  USER_TESTING,
} from "./options";

// Field names match the question ids in config/questions.ts.

const answer = z
  .string()
  .trim()
  .min(1, "Answer this question")
  .max(2000, "Keep it under 2,000 characters");
const shortAnswer = z.string().trim().min(1, "Answer this question").max(100, "Keep it short");
// The form sends numbers with valueAsNumber, so an empty box arrives as NaN and fails here.
const count = z
  .number({ error: "Enter a number" })
  .int("Enter a whole number")
  .min(0, "Enter 0 or more");

export const StageSchema = z.object({ stage: z.enum(PRODUCT_STAGES, { error: "Choose a stage" }) });

export type StageInput = z.infer<typeof StageSchema>;

export const ProposedAnswersSchema = z.object({
  productIdea: answer,
  mainProblem: answer,
  targetCustomer: z.enum(TARGET_CUSTOMERS, { error: "Choose one" }),
  problemConfidence: z.enum(CONFIDENCE_LEVELS, { error: "Choose one" }),
  customerConversations: z.enum(CUSTOMER_CONVERSATIONS, { error: "Choose one" }),
  customersInterviewed: count,
  customerNeed: answer,
  competitionLevel: z.enum(COMPETITION_LEVELS, { error: "Choose one" }),
  differentiation: answer,
  paymentResearch: z.enum(PAYMENT_RESEARCH, { error: "Choose one" }),
  adoptionBarriers: z.array(z.enum(ADOPTION_BARRIERS)).min(1, "Choose at least one"),
});

export const DevelopmentAnswersSchema = z.object({
  buildStage: z.enum(BUILD_STAGES, { error: "Choose one" }),
  currentFeatures: answer,
  userTesting: z.enum(USER_TESTING, { error: "Choose one" }),
  userFeedback: answer,
  bestFeature: answer,
  worstFeature: answer,
  missingFeatures: answer,
  solutionConfidence: z.enum(CONFIDENCE_LEVELS, { error: "Choose one" }),
  currentAlternatives: answer,
  launchConcern: z.enum(LAUNCH_CONCERNS, { error: "Choose one" }),
  improvementArea: answer,
});

export const FailedAnswersSchema = z.object({
  launchDate: shortAnswer,
  originalPurpose: answer,
  expectedUsers: count,
  actualUsers: count,
  performanceProblem: z.enum(PERFORMANCE_PROBLEMS, { error: "Choose one" }),
  commonComplaints: answer,
  churnFrequency: z.enum(CHURN_FREQUENCIES, { error: "Choose one" }),
  rarelyUsedFeatures: answer,
  preferredCompetitors: z.enum(COMPETITOR_PREFERENCES, { error: "Choose one" }),
  competitorReasons: answer,
  marketChange: z.enum(MARKET_CHANGES, { error: "Choose one" }),
  feedbackSpeed: z.enum(FEEDBACK_SPEEDS, { error: "Choose one" }),
  failureReason: answer,
});

export type ProposedAnswers = z.infer<typeof ProposedAnswersSchema>;
export type DevelopmentAnswers = z.infer<typeof DevelopmentAnswersSchema>;
export type FailedAnswers = z.infer<typeof FailedAnswersSchema>;

// Each stage's full rules. A finished assessment must pass these before a report is made.
export const ANSWER_SCHEMAS = {
  proposed: ProposedAnswersSchema,
  development: DevelopmentAnswersSchema,
  failed: FailedAnswersSchema,
};

// A draft is saved one section at a time, so every answer may still be missing. Whatever is
// there must still be valid.
export const DRAFT_SCHEMAS = {
  proposed: ProposedAnswersSchema.partial(),
  development: DevelopmentAnswersSchema.partial(),
  failed: FailedAnswersSchema.partial(),
};

export type DraftAnswers = Partial<ProposedAnswers & DevelopmentAnswers & FailedAnswers>;

// What the AI must return. Checked before it is saved, so a malformed reply is never stored.
const point = z.string().trim().min(1);

export const ReportSchema = z.object({
  swot: z.object({
    strengths: z.array(point).min(1),
    weaknesses: z.array(point).min(1),
    opportunities: z.array(point).min(1),
    threats: z.array(point).min(1),
  }),
  blockers: z
    .array(
      z.object({
        title: point,
        risk: z.enum(RISK_LEVELS),
        evidence: point,
        impact: point,
        action: point,
      }),
    )
    .min(1),
  marketResearch: z
    .array(
      z.object({
        area: point,
        whyItMatters: point,
        investigate: z.array(point).min(1),
        method: point,
      }),
    )
    .min(1),
  recommendations: z
    .array(
      z.object({
        priority: z.enum(PRIORITIES),
        problem: point,
        recommendation: point,
        benefit: point,
      }),
    )
    .min(1),
  // The ids of the scenarios found in Pinecone, so every report shows what it was based on.
  sources: z.array(z.string()),
});

export type Report = z.infer<typeof ReportSchema>;
