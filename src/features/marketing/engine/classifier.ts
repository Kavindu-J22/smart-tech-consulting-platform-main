import type { AudienceIntelligenceReport } from "@/features/marketing/schema";

export interface ClassifierInput {
  techComfort: string; // "comfort_1" .. "comfort_5"
  techTermsFamiliarity: string; // "terms_1" .. "terms_5"
  primaryTargetCustomer: string;
  customerRole: string;
  industry: string;
  marketType: string;
}

/**
 * Calculates rule-based baseline technical literacy level directly from Q10 + Q11 structured scores.
 * Rule: Sum <= 4 => low; Sum >= 8 => high; Else => medium.
 */
export function calculateRuleBaselineLiteracy(
  comfortLevel: string,
  termsLevel: string,
): "low" | "medium" | "high" {
  const comfortScore = parseInt(comfortLevel.replace("comfort_", ""), 10) || 3;
  const termsScore = parseInt(termsLevel.replace("terms_", ""), 10) || 3;
  const sum = comfortScore + termsScore;

  if (sum <= 4) return "low";
  if (sum >= 8) return "high";
  return "medium";
}

const HIGH_TECH_KEYWORDS = [
  "api",
  "sdk",
  "developer",
  "engineer",
  "architecture",
  "microservices",
  "devops",
  "cloud",
  "latency",
  "throughput",
  "infrastructure",
  "database",
  "sql",
  "nosql",
  "docker",
  "kubernetes",
  "ci/cd",
  "graphql",
  "rest",
  "backend",
  "frontend",
  "full-stack",
  "pipeline",
  "telemetry",
  "security",
  "encryption",
];

const LOW_TECH_KEYWORDS = [
  "simple",
  "easy",
  "basic",
  "manual",
  "traditional",
  "elderly",
  "rural",
  "paper",
  "non-technical",
  "beginner",
  "layman",
  "shopkeeper",
  "casual",
  "grassroots",
];

/**
 * NLP-assisted target audience technical literacy classification (FR3).
 * Fuses structured questionnaire signals with open-ended audience text description.
 */
export function classifyAudienceTechnicalLiteracy(
  input: ClassifierInput,
): AudienceIntelligenceReport {
  const comfortScore = parseInt(input.techComfort.replace("comfort_", ""), 10) || 3;
  const termsScore = parseInt(input.techTermsFamiliarity.replace("terms_", ""), 10) || 3;
  const ruleBaseline = calculateRuleBaselineLiteracy(input.techComfort, input.techTermsFamiliarity);

  // Analyze textual vocabulary in primaryTargetCustomer
  const textLower = (input.primaryTargetCustomer || "").toLowerCase();
  let highKeywordHits = 0;
  let lowKeywordHits = 0;

  for (const kw of HIGH_TECH_KEYWORDS) {
    if (textLower.includes(kw)) highKeywordHits++;
  }
  for (const kw of LOW_TECH_KEYWORDS) {
    if (textLower.includes(kw)) lowKeywordHits++;
  }

  // Base logit scores from structured comfort & terms
  let logitLow = 0.0;
  let logitMed = 0.0;
  let logitHigh = 0.0;

  // Structured contribution
  if (comfortScore + termsScore <= 4) {
    logitLow += 2.0;
    logitMed += 0.5;
  } else if (comfortScore + termsScore >= 8) {
    logitHigh += 2.2;
    logitMed += 0.5;
  } else {
    logitMed += 2.0;
    logitLow += 0.4;
    logitHigh += 0.4;
  }

  // Role contribution
  if (["it_professional"].includes(input.customerRole)) {
    logitHigh += 1.8;
  } else if (["business_owner", "manager", "accountant"].includes(input.customerRole)) {
    logitMed += 1.2;
    if (input.industry === "fintech" || input.industry === "cybersecurity") {
      logitHigh += 0.6;
    }
  } else if (["general_consumer", "student"].includes(input.customerRole)) {
    logitLow += 0.8;
    logitMed += 0.8;
  }

  // Industry contribution
  if (["ai_ml", "cybersecurity", "saas"].includes(input.industry)) {
    logitHigh += 0.8;
  } else if (["ecommerce", "healthtech", "edtech"].includes(input.industry)) {
    logitMed += 0.8;
  }

  // Text keyword contribution
  logitHigh += Math.min(2.0, highKeywordHits * 0.6);
  logitLow += Math.min(2.0, lowKeywordHits * 0.6);

  // Softmax normalization to obtain probabilities
  const maxLogit = Math.max(logitLow, logitMed, logitHigh);
  const expLow = Math.exp(logitLow - maxLogit);
  const expMed = Math.exp(logitMed - maxLogit);
  const expHigh = Math.exp(logitHigh - maxLogit);
  const sumExp = expLow + expMed + expHigh;

  const probLow = Number((expLow / sumExp).toFixed(4));
  const probMed = Number((expMed / sumExp).toFixed(4));
  const probHigh = Number((expHigh / sumExp).toFixed(4));

  // Determine winning class
  let winningTier: "low" | "medium" | "high" = "medium";
  let maxProb = probMed;

  if (probLow > maxProb) {
    winningTier = "low";
    maxProb = probLow;
  }
  if (probHigh > maxProb) {
    winningTier = "high";
    maxProb = probHigh;
  }

  // Explanatory reason codes
  const reasonCodes: string[] = [];
  reasonCodes.push(
    `Structured indicator: Technology comfort score of ${comfortScore}/5 and terminology familiarity of ${termsScore}/5.`,
  );
  if (highKeywordHits > 0) {
    reasonCodes.push(
      `Text analysis: Identified ${highKeywordHits} high-technology vocabulary marker(s) in audience description.`,
    );
  }
  if (lowKeywordHits > 0) {
    reasonCodes.push(
      `Text analysis: Identified ${lowKeywordHits} non-technical / consumer marker(s) in audience description.`,
    );
  }
  reasonCodes.push(
    `Role alignment: Target customer role '${input.customerRole.replace(/_/g, " ")}' informs digital workflow proficiency.`,
  );

  const uncertaintyCaveat =
    "Classification combines structured self-reported signals and vocabulary extraction. Empirical field validation with real customer cohorts is pending.";

  return {
    literacyTier: winningTier,
    probabilities: {
      low: probLow,
      medium: probMed,
      high: probHigh,
    },
    confidenceScore: Number(maxProb.toFixed(3)),
    uncertaintyCaveat,
    ruleBaselineTier: ruleBaseline,
    reasonCodes,
    modelType: "Multimodal Heuristic + Vocabulary Fusion Classifier (FR3)",
    isEmpiricallyValidated: false,
  };
}
