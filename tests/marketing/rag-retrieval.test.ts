import test from "node:test";
import assert from "node:assert";
import {
  buildMarketingSearchQuery,
  retrieveMarketingKnowledge,
  MARKETING_PINECONE_NAMESPACE,
} from "@/features/marketing/engine/retrieve-marketing-knowledge";
import type { MarketingAnswers } from "@/features/marketing/schema";

const mockAnswers: MarketingAnswers = {
  productName: "CeylonDevOps Cloud",
  productDescription: "Container orchestration platform for Sri Lankan tech startups.",
  mainFeatures: "Kubernetes autoscaling, Docker image scanning, SLT fiber edge hosting",
  industry: "saas",
  primaryTargetCustomer: "Engineering managers and CTOs in Colombo",
  marketType: "b2b",
  ageGroup: null,
  customerRole: "it_professional",
  audienceLocation: "western_province",
  techComfort: "comfort_5",
  techTermsFamiliarity: "terms_5",
  messageDetailPreference: "detail_3",
  keyCustomerBenefit: "Reduces cloud infrastructure latency for local Sri Lankan end-users",
  customerPainPoints: ["saves_time", "reduces_costs"],
  channelsCurrentlyUsed: ["linkedin", "website_seo"],
  channelsWorkingBest: ["linkedin"],
  preferredContent: ["case_studies", "articles_blogs"],
  monthlyBudgetLkr: 150000,
  budgetFlexibility: "moderately_flexible",
  campaignDuration: "duration_6m",
  campaignGoals: ["leads"],
  reservePercentage: 10,
};

test("Marketing RAG - query construction builds clean semantic context without secrets", () => {
  const query = buildMarketingSearchQuery(mockAnswers);
  assert.ok(query.includes("Market: B2B"));
  assert.ok(query.includes("CeylonDevOps Cloud"));
  assert.ok(query.includes("leads"));
  assert.ok(query.includes("linkedin"));
  assert.ok(!query.includes("apiKey"));
  assert.ok(!query.includes("password"));
});

test("Marketing RAG - namespace isolation is strictly marketing-kalana-v1", () => {
  assert.strictEqual(MARKETING_PINECONE_NAMESPACE, "marketing-kalana-v1");
  assert.notStrictEqual(MARKETING_PINECONE_NAMESPACE, "product");
});

test("Marketing RAG - runtime retrieval returns valid structured evidence with MKT-LK- IDs", async () => {
  const result = await retrieveMarketingKnowledge(mockAnswers);

  assert.strictEqual(result.namespace, "marketing-kalana-v1");
  assert.ok(["pinecone_rag", "local_dataset_fallback"].includes(result.source));
  assert.ok(Array.isArray(result.evidence));
  assert.ok(result.evidence.length > 0, "Should retrieve at least one marketing evidence record");

  for (const item of result.evidence) {
    assert.match(item.id, /^MKT-LK-\d{3}$/, `Item ID ${item.id} should match MKT-LK-### pattern`);
    assert.ok(item.title.length > 0);
    assert.ok(item.claim.length > 0);
    assert.ok(item.sourceTitle.length > 0);
    assert.ok(item.sourceUrl.startsWith("https://"));
    assert.ok(item.publisher.length > 0);
    assert.ok(item.caveat.length > 0);
  }
});
