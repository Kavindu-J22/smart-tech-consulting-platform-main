import test from "node:test";
import assert from "node:assert";
import {
  calculateSUSScore,
  computeClassificationMetrics,
} from "@/features/marketing/engine/evaluation";

test("calculateSUSScore - Brooke 1996 standard scoring formula", () => {
  // Perfect usability responses: 5 for odd questions, 1 for even questions
  // Odd: 5 - 1 = 4; Even: 5 - 1 = 4. 10 * 4 = 40. 40 * 2.5 = 100.
  const perfect = [5, 1, 5, 1, 5, 1, 5, 1, 5, 1];
  const resPerfect = calculateSUSScore(perfect);
  assert.strictEqual(resPerfect.susScore, 100.0);
  assert.strictEqual(resPerfect.grade, "A");
  assert.strictEqual(resPerfect.isAboveIndustryAverage, true);

  // Neutral responses: 3 for all questions
  // (3 - 1) = 2; (5 - 3) = 2. 10 * 2 = 20. 20 * 2.5 = 50.
  const neutral = [3, 3, 3, 3, 3, 3, 3, 3, 3, 3];
  const resNeutral = calculateSUSScore(neutral);
  assert.strictEqual(resNeutral.susScore, 50.0);
  assert.strictEqual(resNeutral.grade, "D");
  assert.strictEqual(resNeutral.isAboveIndustryAverage, false);

  // Realistic Good Score: [4, 2, 4, 2, 4, 2, 4, 2, 4, 2]
  // (4-1)=3; (5-2)=3. 10 * 3 = 30 * 2.5 = 75.
  const good = [4, 2, 4, 2, 4, 2, 4, 2, 4, 2];
  const resGood = calculateSUSScore(good);
  assert.strictEqual(resGood.susScore, 75.0);
  assert.strictEqual(resGood.grade, "B");
  assert.strictEqual(resGood.isAboveIndustryAverage, true);
});

test("computeClassificationMetrics - evaluates accuracy, precision, recall, and F1", () => {
  const actual = ["low", "low", "medium", "medium", "high", "high"];
  const predicted = ["low", "medium", "medium", "medium", "high", "low"];

  const metrics = computeClassificationMetrics(actual, predicted);
  assert.strictEqual(metrics.totalSamples, 6);
  // Correct: actual[0] == pred[0], actual[2] == pred[2], actual[3] == pred[3], actual[4] == pred[4] => 4/6 = 0.6667
  assert.ok(Math.abs(metrics.accuracy - 0.6667) < 0.001);
  assert.ok(metrics.macroF1 > 0);
  assert.ok(metrics.weightedF1 > 0);
  assert.strictEqual(metrics.confusionMatrix["low"]["low"], 1);
  assert.strictEqual(metrics.confusionMatrix["low"]["medium"], 1);
  assert.strictEqual(metrics.confusionMatrix["medium"]["medium"], 2);
  assert.strictEqual(metrics.confusionMatrix["high"]["high"], 1);
});
