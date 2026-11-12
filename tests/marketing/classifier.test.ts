import test from "node:test";
import assert from "node:assert";
import {
  calculateRuleBaselineLiteracy,
  classifyAudienceTechnicalLiteracy,
} from "@/features/marketing/engine/classifier";

test("calculateRuleBaselineLiteracy - threshold boundaries (Q10 + Q11)", () => {
  // Low: comfort 1 + terms 1 = 2 (<= 4)
  assert.strictEqual(calculateRuleBaselineLiteracy("comfort_1", "terms_1"), "low");
  // Low boundary: comfort 2 + terms 2 = 4 (<= 4)
  assert.strictEqual(calculateRuleBaselineLiteracy("comfort_2", "terms_2"), "low");

  // Medium: comfort 3 + terms 2 = 5
  assert.strictEqual(calculateRuleBaselineLiteracy("comfort_3", "terms_2"), "medium");
  // Medium upper boundary: comfort 3 + terms 4 = 7
  assert.strictEqual(calculateRuleBaselineLiteracy("comfort_3", "terms_4"), "medium");

  // High boundary: comfort 4 + terms 4 = 8 (>= 8)
  assert.strictEqual(calculateRuleBaselineLiteracy("comfort_4", "terms_4"), "high");
  // High: comfort 5 + terms 5 = 10 (>= 8)
  assert.strictEqual(calculateRuleBaselineLiteracy("comfort_5", "terms_5"), "high");
});

test("classifyAudienceTechnicalLiteracy - fuses text keywords with structured signals", () => {
  // Tech audience with high vocabulary
  const resultHigh = classifyAudienceTechnicalLiteracy({
    techComfort: "comfort_4",
    techTermsFamiliarity: "terms_4",
    primaryTargetCustomer:
      "Senior backend software engineers and DevOps architects using Kubernetes, Docker, and REST API microservices.",
    customerRole: "it_professional",
    industry: "saas",
    marketType: "b2b",
  });

  assert.strictEqual(resultHigh.literacyTier, "high");
  assert.ok(resultHigh.probabilities.high > 0.5, "High probability should exceed 50%");
  assert.strictEqual(resultHigh.ruleBaselineTier, "high");
  assert.ok(resultHigh.reasonCodes.some((r) => r.includes("high-technology vocabulary marker")));

  // Non-technical consumer audience
  const resultLow = classifyAudienceTechnicalLiteracy({
    techComfort: "comfort_1",
    techTermsFamiliarity: "terms_1",
    primaryTargetCustomer:
      "Elderly traditional shopkeepers and grassroots farmers who manage stock on paper and require simple basic help.",
    customerRole: "general_consumer",
    industry: "ecommerce",
    marketType: "b2c",
  });

  assert.strictEqual(resultLow.literacyTier, "low");
  assert.ok(resultLow.probabilities.low > 0.5, "Low probability should exceed 50%");
  assert.strictEqual(resultLow.ruleBaselineTier, "low");
});
