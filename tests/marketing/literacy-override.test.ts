import test from "node:test";
import assert from "node:assert";
import {
  calculateRuleBaselineLiteracy,
  classifyAudienceTechnicalLiteracy,
} from "@/features/marketing/engine/classifier";
import { generateDeterministicFallback } from "@/features/marketing/engine/translator";

test("Literacy Classifier - Rule Baseline Q10+Q11 calculations", () => {
  assert.strictEqual(calculateRuleBaselineLiteracy("comfort_1", "terms_1"), "low"); // sum=2 <= 4
  assert.strictEqual(calculateRuleBaselineLiteracy("comfort_2", "terms_2"), "low"); // sum=4 <= 4
  assert.strictEqual(calculateRuleBaselineLiteracy("comfort_3", "terms_3"), "medium"); // sum=6
  assert.strictEqual(calculateRuleBaselineLiteracy("comfort_4", "terms_4"), "high"); // sum=8 >= 8
  assert.strictEqual(calculateRuleBaselineLiteracy("comfort_5", "terms_5"), "high"); // sum=10 >= 8
});

test("Literacy Classifier - Low Persona and vocabulary yields Low recommendation", () => {
  const result = classifyAudienceTechnicalLiteracy({
    techComfort: "comfort_1",
    techTermsFamiliarity: "terms_1",
    primaryTargetCustomer: "Elderly traditional shopkeepers and rural farmers managing cash with paper ledgers.",
    customerRole: "general_consumer",
    industry: "ecommerce",
    marketType: "b2c",
  });

  assert.strictEqual(result.questionnaireBaselineTier, "low");
  assert.strictEqual(result.nlpSuggestedTier, "low");
  assert.strictEqual(result.effectiveMessageTier, "low");
  assert.strictEqual(result.literacyTier, "low");
  assert.strictEqual(result.overriddenByUser, false);
  assert.strictEqual(result.heuristicSignalLabel, "Heuristic Classification Signal (Uncalibrated)");
  assert.match(result.uncertaintyCaveat, /relative heuristic indicator/);

  // Fallback copy generator
  const copy = generateDeterministicFallback({
    productName: "GoviAlert LK",
    productDescription: "Voice SMS weather and market price updates.",
    mainFeatures: "Sinhala voice calls, SMS notifications, daily wholesale vegetable market rates",
    industry: "ecommerce",
    primaryTargetCustomer: "Elderly rural farmers in Dambulla",
    literacyTier: result.effectiveMessageTier,
    keyCustomerBenefit: "Know vegetable market prices before harvest",
    customerPainPoints: ["reduces_costs"],
    campaignGoals: ["brand_awareness"],
  });

  assert.strictEqual(copy.recommendedMessage, copy.simpleMessage);
  assert.strictEqual(copy.generationSource, "Template Fallback");
  // Must NOT hallucinate zero downtime or enterprise scale
  assert.ok(!copy.technicalMessage.includes("zero downtime"));
});

test("Literacy Classifier - High Persona yields High recommendation grounded in features", () => {
  const result = classifyAudienceTechnicalLiteracy({
    techComfort: "comfort_5",
    techTermsFamiliarity: "terms_5",
    primaryTargetCustomer: "Principal DevOps engineers and cloud architecture leads managing microservices telemetry.",
    customerRole: "it_professional",
    industry: "saas",
    marketType: "b2b",
  });

  assert.strictEqual(result.questionnaireBaselineTier, "high");
  assert.strictEqual(result.nlpSuggestedTier, "high");
  assert.strictEqual(result.effectiveMessageTier, "high");
  assert.strictEqual(result.literacyTier, "high");

  // Fallback copy generator
  const copy = generateDeterministicFallback({
    productName: "LogMesh LK",
    productDescription: "Distributed tracing engine for Kubernetes clusters.",
    mainFeatures: "eBPF kernel probes, OpenTelemetry exporter, sub-second latency alerts",
    industry: "saas",
    primaryTargetCustomer: "Principal DevOps engineers in Colombo",
    literacyTier: result.effectiveMessageTier,
    keyCustomerBenefit: "Diagnose production microservice latency bottlenecks in seconds",
    customerPainPoints: ["saves_time"],
    campaignGoals: ["qualified_leads"],
  });

  assert.strictEqual(copy.recommendedMessage, copy.technicalMessage);
  // Grounded in declared features
  assert.ok(copy.technicalMessage.includes("eBPF kernel probes"));
  assert.ok(copy.technicalMessage.includes("OpenTelemetry exporter"));
  // Must NOT contain invented claims
  assert.ok(!copy.technicalMessage.includes("zero downtime"));
});

test("Literacy Classifier - Explicit User Override is honored in Effective Tier and Copy", () => {
  // Moderate input that naturally classifies as medium
  const result = classifyAudienceTechnicalLiteracy({
    techComfort: "comfort_3",
    techTermsFamiliarity: "terms_3",
    primaryTargetCustomer: "Finance executives and retail accountants in Kandy.",
    customerRole: "accountant",
    industry: "fintech",
    marketType: "b2b",
    targetAudienceLiteracyOverride: "low", // User explicitly overrides to Low
  });

  // Algorithmic signals remain transparent
  assert.strictEqual(result.questionnaireBaselineTier, "medium");
  assert.strictEqual(result.nlpSuggestedTier, "medium");
  // But effective tier respects founder's override
  assert.strictEqual(result.effectiveMessageTier, "low");
  assert.strictEqual(result.literacyTier, "low");
  assert.strictEqual(result.overriddenByUser, true);

  // Copy should match the override
  const copy = generateDeterministicFallback({
    productName: "LankaTax Cloud",
    productDescription: "Automated VAT return generator for SMEs.",
    mainFeatures: "Invoice OCR, IRD RAMIS direct upload, LankaQR receipts",
    industry: "fintech",
    primaryTargetCustomer: "Accountants in Kandy",
    literacyTier: result.effectiveMessageTier,
    keyCustomerBenefit: "File accurate quarterly tax returns in 10 minutes",
    customerPainPoints: ["saves_time"],
    campaignGoals: ["qualified_leads"],
  });

  assert.strictEqual(copy.recommendedMessage, copy.simpleMessage);
});
