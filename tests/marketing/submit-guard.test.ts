import test from "node:test";
import assert from "node:assert";
import {
  MarketingAnswersSchema,
  MarketingDraftSchema,
} from "@/features/marketing/schema";

test("Submit Guard - Unfilled neutral default form fails schema validation", () => {
  // A clean, neutral new assessment form without pre-filled answers
  const emptyForm = {
    productName: "",
    productDescription: "",
    mainFeatures: "",
    industry: undefined,
    primaryTargetCustomer: "",
    marketType: undefined,
    customerRole: undefined,
    audienceLocation: undefined,
    techComfort: undefined,
    techTermsFamiliarity: undefined,
    messageDetailPreference: undefined,
    keyCustomerBenefit: "",
    customerPainPoints: [],
    channelsCurrentlyUsed: [],
    channelsWorkingBest: [],
    preferredContent: [],
    monthlyBudgetLkr: undefined,
    budgetFlexibility: undefined,
    campaignDuration: undefined,
    campaignGoals: [],
    reservePercentage: 0,
  };

  const parsed = MarketingAnswersSchema.safeParse(emptyForm);
  assert.strictEqual(parsed.success, false, "Empty form must NOT validate or permit premature analysis generation");
  if (!parsed.success) {
    assert.ok(parsed.error.issues.length >= 10, "Should catch multiple uncompleted mandatory questions");
  }
});

test("Submit Guard - Save Draft permits saving partial questionnaire responses", () => {
  const partialDraft = {
    productName: "Partial Prototype",
    productDescription: "Just started drafting the assessment",
    marketType: "b2b" as const,
  };

  const parsed = MarketingDraftSchema.safeParse(partialDraft);
  assert.strictEqual(parsed.success, true, "Draft schema must succeed on partial responses");
});

test("Submit Guard - Complete valid form succeeds only when all sections answered", () => {
  const completeForm = {
    productName: "Pay Lanka Pro",
    productDescription: "Integrated payment reconciliation gateway for Sri Lankan e-commerce retailers.",
    mainFeatures: "LankaQR, Visa/Mastercard processing, Settlement webhooks",
    industry: "fintech" as const,
    primaryTargetCustomer: "eCommerce merchants in Western Province",
    marketType: "b2b" as const,
    customerRole: "business_owner" as const,
    audienceLocation: "western_province" as const,
    techComfort: "comfort_3" as const,
    techTermsFamiliarity: "terms_3" as const,
    messageDetailPreference: "detail_3" as const,
    keyCustomerBenefit: "Instant settlements and automated order reconciliation",
    customerPainPoints: ["saves_time" as const, "reduces_costs" as const],
    channelsCurrentlyUsed: ["facebook" as const, "linkedin" as const],
    channelsWorkingBest: ["facebook" as const],
    preferredContent: ["product_demos" as const, "case_studies" as const],
    monthlyBudgetLkr: 80000,
    budgetFlexibility: "moderately_flexible" as const,
    campaignDuration: "duration_3m" as const,
    campaignGoals: ["leads" as const, "sales" as const],
    reservePercentage: 10,
  };

  const parsed = MarketingAnswersSchema.safeParse(completeForm);
  assert.strictEqual(parsed.success, true, "Complete valid form validates successfully for intentional Run");
});
