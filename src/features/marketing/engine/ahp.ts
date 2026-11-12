import {
  AHP_CRITERIA,
  DEFAULT_AHP_WEIGHTS,
  MARKETING_CHANNEL_LABELS,
  SAATY_RANDOM_INDEX,
} from "@/features/marketing/options";
import { CHANNEL_PROFILES } from "@/features/marketing/config/channels";
import type { AHPReport, RankedChannelItem } from "@/features/marketing/schema";

export interface AHPWeightsResult {
  weights: number[];
  lambdaMax: number;
  ci: number;
  cr: number;
  isConsistent: boolean;
}

/**
 * Computes priority weights, lambda_max, Consistency Index (CI), and Consistency Ratio (CR)
 * from an n x n Saaty pairwise comparison matrix using the Normalized Geometric Mean Method
 * (Logarithmic Least Squares / principal eigenvector equivalent).
 */
export function calculateAHPWeights(matrix: number[][]): AHPWeightsResult {
  const n = matrix.length;
  if (n === 0 || matrix.some((row) => row.length !== n)) {
    throw new Error(`AHP pairwise matrix must be square. Received ${n}x${matrix[0]?.length ?? 0}`);
  }

  // Trivial cases n <= 2
  if (n === 1) {
    return { weights: [1.0], lambdaMax: 1.0, ci: 0.0, cr: 0.0, isConsistent: true };
  }
  if (n === 2) {
    const a12 = matrix[0][1];
    const w1 = a12 / (1.0 + a12);
    const w2 = 1.0 / (1.0 + a12);
    return { weights: [w1, w2], lambdaMax: 2.0, ci: 0.0, cr: 0.0, isConsistent: true };
  }

  // Row geometric means
  const geomMeans = matrix.map((row) => {
    const product = row.reduce((acc, val) => acc * val, 1.0);
    return Math.pow(product, 1.0 / n);
  });
  const sumGeomMeans = geomMeans.reduce((acc, val) => acc + val, 0.0);
  const weights = geomMeans.map((gm) => gm / sumGeomMeans);

  // Compute lambda_max: (Aw)_i = sum_j (A[i][j] * w[j])
  let lambdaMax = 0.0;
  for (let i = 0; i < n; i++) {
    let aw_i = 0.0;
    for (let j = 0; j < n; j++) {
      aw_i += matrix[i][j] * weights[j];
    }
    lambdaMax += aw_i / weights[i];
  }
  lambdaMax /= n;

  // Consistency Index
  const ci = Math.max(0.0, (lambdaMax - n) / (n - 1));

  // Consistency Ratio
  const ri = SAATY_RANDOM_INDEX[n] ?? 1.49;
  const cr = ri > 0 ? ci / ri : 0.0;
  const isConsistent = cr <= 0.1;

  return {
    weights: weights.map((w) => Number(w.toFixed(4))),
    lambdaMax: Number(lambdaMax.toFixed(4)),
    ci: Number(ci.toFixed(4)),
    cr: Number(cr.toFixed(4)),
    isConsistent,
  };
}

export interface AHPEvaluationInput {
  marketType: "b2b" | "b2c" | "both";
  audienceLiteracy: "low" | "medium" | "high";
  campaignGoal: string;
  monthlyBudgetLkr: number;
  audienceLocation: string;
  preferredContent: string[];
  customPairwiseMatrix?: number[][];
}

/**
 * Runs multi-criteria AHP channel evaluation across the 8 candidate marketing channels.
 */
export function evaluateAHPChannels(input: AHPEvaluationInput): AHPReport {
  let criteriaWeights = DEFAULT_AHP_WEIGHTS;
  let cr = 0.042;
  let isConsistent = true;
  let isAssumed = true;
  let weightVersion = "v1-synthetic-assumed";

  // If user or expert provides a custom 5x5 pairwise comparison matrix
  if (input.customPairwiseMatrix && input.customPairwiseMatrix.length === 5) {
    const ahpRes = calculateAHPWeights(input.customPairwiseMatrix);
    criteriaWeights = {
      audience_fit: ahpRes.weights[0],
      objective_fit: ahpRes.weights[1],
      cost_suitability: ahpRes.weights[2],
      reach_fit: ahpRes.weights[3],
      content_fit: ahpRes.weights[4],
    };
    cr = ahpRes.cr;
    isConsistent = ahpRes.isConsistent;
    isAssumed = false;
    weightVersion = "custom-expert-matrix";
  }

  const scoredChannels: RankedChannelItem[] = [];

  for (const [chId, profile] of Object.entries(CHANNEL_PROFILES)) {
    const audScore = scoreAudienceFit(profile, input.marketType, input.audienceLiteracy);
    const objScore = scoreObjectiveFit(chId, input.campaignGoal);
    const costScore = scoreCostSuitability(profile, input.monthlyBudgetLkr);
    const reachScore = scoreReachFit(profile.sriLankaReachRate, input.audienceLocation);
    const contentScore = scoreContentFit(profile.supportedContent, input.preferredContent);

    const scores: Record<string, number> = {
      audience_fit: audScore,
      objective_fit: objScore,
      cost_suitability: costScore,
      reach_fit: reachScore,
      content_fit: contentScore,
    };

    let totalScore = 0.0;
    const criterionContributions: Record<string, number> = {};

    for (const crit of AHP_CRITERIA) {
      const w = criteriaWeights[crit] ?? 0.2;
      const s = scores[crit] ?? 0.5;
      const contribution = Number((w * s * 100).toFixed(2));
      criterionContributions[crit] = contribution;
      totalScore += contribution;
    }

    const topFactor = Object.entries(scores).reduce((prev, curr) =>
      curr[1] > prev[1] ? curr : prev,
    );
    const rationale = `Ranked with strong ${topFactor[0].replace(/_/g, " ")} (${Math.round(topFactor[1] * 100)}%) for ${input.marketType.toUpperCase()} products in Sri Lanka.`;

    scoredChannels.push({
      rank: 0,
      channelId: chId,
      channelName: MARKETING_CHANNEL_LABELS[chId] || profile.name,
      score: Number(totalScore.toFixed(1)),
      isRecommended: false,
      criterionContributions,
      rationale,
      evidenceNotes: profile.evidenceNotes,
      reachRate: profile.sriLankaReachRate,
      costIndex: profile.relativeCostIndex,
    });
  }

  // Sort descending by score
  scoredChannels.sort((a, b) => b.score - a.score);

  // Set ranks and recommendations: top 2 if budget < 15,000 LKR, else top 3
  const topK = input.monthlyBudgetLkr < 15000 ? 2 : 3;
  scoredChannels.forEach((item, index) => {
    item.rank = index + 1;
    item.isRecommended = index < topK;
  });

  // Calculate rule-based channel selection baseline for research comparison
  const ruleBaselineChannels = calculateRuleChannelBaseline(
    input.marketType,
    input.monthlyBudgetLkr,
  );

  return {
    rankedChannels: scoredChannels,
    criteriaWeights: {
      audience_fit: criteriaWeights.audience_fit,
      objective_fit: criteriaWeights.objective_fit,
      cost_suitability: criteriaWeights.cost_suitability,
      reach_fit: criteriaWeights.reach_fit,
      content_fit: criteriaWeights.content_fit,
    },
    consistencyRatio: cr,
    isConsistent,
    ruleBaselineChannels,
    weightVersion,
    isAssumedWeights: isAssumed,
    methodDisclaimer:
      "AHP scores reflect multi-criteria strategic alignment under current Sri Lankan digital market assumptions, NOT guaranteed commercial ROI.",
  };
}

function scoreAudienceFit(
  profile: (typeof CHANNEL_PROFILES)[string],
  marketType: "b2b" | "b2c" | "both",
  literacy: "low" | "medium" | "high",
): number {
  let base = profile.marketAffinity[marketType] ?? 0.7;
  const litAffinity = profile.literacyAffinity[literacy] ?? 0.7;
  base = base * 0.7 + litAffinity * 0.3;
  return Math.min(0.99, Math.max(0.15, Number(base.toFixed(2))));
}

function scoreObjectiveFit(channelId: string, goal: string): number {
  const goalMap: Record<string, Record<string, number>> = {
    website_visitors: {
      website_seo: 0.97,
      google_ads: 0.94,
      facebook: 0.74,
      youtube: 0.72,
      linkedin: 0.68,
      instagram: 0.63,
      tiktok: 0.6,
      email_marketing: 0.62,
    },
    leads: {
      linkedin: 0.95,
      google_ads: 0.92,
      website_seo: 0.9,
      email_marketing: 0.88,
      facebook: 0.75,
      instagram: 0.65,
      youtube: 0.64,
      tiktok: 0.5,
    },
    sales: {
      google_ads: 0.95,
      facebook: 0.85,
      instagram: 0.83,
      email_marketing: 0.82,
      website_seo: 0.8,
      linkedin: 0.74,
      tiktok: 0.7,
      youtube: 0.68,
    },
    social_engagement: {
      facebook: 0.95,
      instagram: 0.96,
      tiktok: 0.97,
      youtube: 0.88,
      linkedin: 0.72,
      google_ads: 0.5,
      email_marketing: 0.42,
      website_seo: 0.45,
    },
    brand_awareness: {
      facebook: 0.95,
      youtube: 0.92,
      instagram: 0.89,
      tiktok: 0.94,
      linkedin: 0.72,
      google_ads: 0.7,
      website_seo: 0.7,
      email_marketing: 0.55,
    },
  };

  const lookup = goalMap[goal] ?? goalMap.brand_awareness;
  return lookup[channelId] ?? 0.65;
}

function scoreCostSuitability(
  profile: (typeof CHANNEL_PROFILES)[string],
  monthlyBudgetLkr: number,
): number {
  if (monthlyBudgetLkr === 0) {
    return profile.minViableMonthlyLkr === 0 ? 0.95 : 0.35;
  }
  if (monthlyBudgetLkr < profile.minViableMonthlyLkr) {
    return 0.35;
  }
  if (monthlyBudgetLkr >= 100000) {
    return 0.9;
  }
  if (monthlyBudgetLkr >= 40000) {
    return Math.min(0.95, profile.relativeCostIndex * 0.4 + 0.55);
  }
  return Math.min(0.95, profile.relativeCostIndex * 0.7 + 0.25);
}

function scoreReachFit(reachRate: number, location: string): number {
  if (location === "western_province") {
    return reachRate;
  }
  if (location === "all_island") {
    return Math.min(0.95, reachRate * 1.02);
  }
  return Math.min(0.95, reachRate * 1.05);
}

function scoreContentFit(supportedContent: string[], preferredContent: string[]): number {
  const overlap = preferredContent.filter((c) => supportedContent.includes(c));
  if (overlap.length > 0) {
    return Math.min(0.98, 0.85 + overlap.length * 0.05);
  }
  return 0.5;
}

function calculateRuleChannelBaseline(marketType: string, budgetLkr: number): string[] {
  if (marketType === "b2b") {
    return budgetLkr < 15000
      ? ["linkedin", "email_marketing"]
      : ["linkedin", "google_ads", "website_seo"];
  }
  if (marketType === "b2c") {
    return budgetLkr < 15000 ? ["facebook", "instagram"] : ["facebook", "instagram", "google_ads"];
  }
  return ["facebook", "linkedin", "website_seo"];
}
