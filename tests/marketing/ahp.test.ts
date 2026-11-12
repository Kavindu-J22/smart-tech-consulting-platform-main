import test from "node:test";
import assert from "node:assert";
import { calculateAHPWeights, evaluateAHPChannels } from "@/features/marketing/engine/ahp";

test("AHP Matrix Math - 1x1 trivial matrix", () => {
  const res = calculateAHPWeights([[1.0]]);
  assert.strictEqual(res.weights.length, 1);
  assert.strictEqual(res.weights[0], 1.0);
  assert.strictEqual(res.isConsistent, true);
});

test("AHP Matrix Math - 2x2 reciprocal matrix", () => {
  const res = calculateAHPWeights([
    [1.0, 3.0],
    [1 / 3, 1.0],
  ]);
  assert.strictEqual(res.weights.length, 2);
  assert.strictEqual(res.weights[0], 0.75);
  assert.strictEqual(res.weights[1], 0.25);
  assert.strictEqual(res.isConsistent, true);
});

test("AHP Matrix Math - 3x3 consistent comparison matrix", () => {
  // Classic Saaty example: A is 3x more important than B, 6x more than C; B is 2x more than C
  const matrix = [
    [1.0, 3.0, 6.0],
    [1 / 3, 1.0, 2.0],
    [1 / 6, 1 / 2, 1.0],
  ];
  const res = calculateAHPWeights(matrix);
  assert.strictEqual(res.weights.length, 3);
  assert.ok(Math.abs(res.weights.reduce((a, b) => a + b, 0) - 1.0) < 0.005);
  assert.ok(res.cr <= 0.05, `CR should be small, got ${res.cr}`);
  assert.strictEqual(res.isConsistent, true);
});

test("AHP Matrix Math - 5x5 default criteria weights yield valid consistency", () => {
  // Approximate pairwise comparisons for the 5 criteria:
  // [audience_fit (0.34), objective_fit (0.25), cost_suitability (0.18), reach_fit (0.13), content_fit (0.10)]
  const matrix = [
    [1.0, 1.5, 2.0, 2.5, 3.5],
    [1 / 1.5, 1.0, 1.4, 2.0, 2.5],
    [1 / 2.0, 1 / 1.4, 1.0, 1.4, 1.8],
    [1 / 2.5, 1 / 2.0, 1 / 1.4, 1.0, 1.3],
    [1 / 3.5, 1 / 2.5, 1 / 1.8, 1 / 1.3, 1.0],
  ];
  const res = calculateAHPWeights(matrix);
  assert.strictEqual(res.weights.length, 5);
  assert.ok(
    res.isConsistent,
    `5x5 criteria matrix must be consistent (CR <= 0.10), got CR = ${res.cr}`,
  );
  assert.ok(res.weights[0] > res.weights[1], "Audience fit should weigh more than objective fit");
  assert.ok(
    res.weights[1] > res.weights[2],
    "Objective fit should weigh more than cost suitability",
  );
});

test("evaluateAHPChannels - ranks channels deterministically and recommends top channels", () => {
  const result = evaluateAHPChannels({
    marketType: "b2b",
    audienceLiteracy: "high",
    campaignGoal: "leads",
    monthlyBudgetLkr: 50000,
    audienceLocation: "western_province",
    preferredContent: ["articles_blogs", "case_studies"],
  });

  assert.strictEqual(result.rankedChannels.length, 8);
  assert.strictEqual(result.isConsistent, true);

  // For B2B with high literacy and lead generation goal, high intent B2B channels should be recommended
  const recommendedIds = result.rankedChannels
    .filter((c) => c.isRecommended)
    .map((c) => c.channelId);
  assert.ok(
    recommendedIds.includes("google_ads") || recommendedIds.includes("linkedin"),
    `High-intent B2B channels should be among top recommended for B2B leads. Got recommended: ${recommendedIds.join(", ")}`,
  );
  assert.strictEqual(
    recommendedIds.length,
    3,
    "For 50,000 LKR budget, exactly top 3 should be recommended",
  );
});

test("evaluateAHPChannels - small budget recommends top 2 channels", () => {
  const result = evaluateAHPChannels({
    marketType: "b2c",
    audienceLiteracy: "low",
    campaignGoal: "brand_awareness",
    monthlyBudgetLkr: 10000,
    audienceLocation: "all_island",
    preferredContent: ["short_videos"],
  });

  const recommendedCount = result.rankedChannels.filter((c) => c.isRecommended).length;
  assert.strictEqual(
    recommendedCount,
    2,
    "For budget < 15,000 LKR, exactly top 2 should be recommended",
  );
  assert.strictEqual(result.rankedChannels[0].isRecommended, true);
  assert.strictEqual(result.rankedChannels[1].isRecommended, true);
  assert.strictEqual(result.rankedChannels[2].isRecommended, false);
});
