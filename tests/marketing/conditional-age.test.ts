import test from "node:test";
import assert from "node:assert";
import { MarketingAnswersSchema } from "@/features/marketing/schema";

const basePayload = {
  productName: "Sri Lanka Inventory ERP",
  productDescription: "Cloud-based stock tracking and invoicing platform for multi-branch retailers.",
  mainFeatures: "Barcode scanning, LankaQR payments, VAT automated computation",
  industry: "saas" as const,
  primaryTargetCustomer: "Retail shop owners and retail operations managers in Western Province.",
  customerRole: "business_owner" as const,
  audienceLocation: "western_province" as const,
  techComfort: "comfort_3" as const,
  techTermsFamiliarity: "terms_3" as const,
  messageDetailPreference: "detail_3" as const,
  keyCustomerBenefit: "Accelerates daily store inventory audits and eliminates checkout stock discrepancies.",
  customerPainPoints: ["saves_time" as const, "reduces_errors" as const],
  channelsCurrentlyUsed: ["facebook" as const, "website_seo" as const],
  channelsWorkingBest: ["facebook" as const],
  preferredContent: ["product_demos" as const, "images_graphics" as const],
  monthlyBudgetLkr: 60000,
  budgetFlexibility: "moderately_flexible" as const,
  campaignDuration: "duration_6m" as const,
  campaignGoals: ["leads" as const, "brand_awareness" as const],
  reservePercentage: 10,
};

test("Conditional Validation - Q6='b2b' does NOT require Q7 age group", () => {
  const b2bPayload = {
    ...basePayload,
    marketType: "b2b" as const,
    ageGroup: undefined,
  };

  const parsed = MarketingAnswersSchema.safeParse(b2bPayload);
  assert.strictEqual(parsed.success, true, "B2B assessment should validate without ageGroup");
});

test("Conditional Validation - Q6='both' does NOT require Q7 age group", () => {
  const bothPayload = {
    ...basePayload,
    marketType: "both" as const,
    ageGroup: null,
  };

  const parsed = MarketingAnswersSchema.safeParse(bothPayload);
  assert.strictEqual(parsed.success, true, "Both (B2B and B2C) assessment should validate with null ageGroup");
});

test("Conditional Validation - Q6='b2c' REQUIRES Q7 age group", () => {
  const b2cWithoutAge = {
    ...basePayload,
    marketType: "b2c" as const,
    ageGroup: undefined,
  };

  const parsed = MarketingAnswersSchema.safeParse(b2cWithoutAge);
  assert.strictEqual(parsed.success, false, "B2C assessment must fail validation when ageGroup is missing");
  if (!parsed.success) {
    const ageIssue = parsed.error.issues.find((i) => i.path.includes("ageGroup"));
    assert.ok(ageIssue, "Should report issue on ageGroup field");
    assert.match(ageIssue.message, /B2C consumer targeting/);
  }
});

test("Conditional Validation - Q6='b2c' with valid age group succeeds", () => {
  const b2cWithAge = {
    ...basePayload,
    marketType: "b2c" as const,
    ageGroup: "age_25_34" as const,
  };

  const parsed = MarketingAnswersSchema.safeParse(b2cWithAge);
  assert.strictEqual(parsed.success, true, "B2C assessment with age_25_34 should validate successfully");
});

test("Conditional Validation - transition simulation: b2c -> b2b -> both -> b2c", () => {
  // 1. Initial B2C without age fails
  const step1 = MarketingAnswersSchema.safeParse({ ...basePayload, marketType: "b2c" });
  assert.strictEqual(step1.success, false);

  // 2. Select age for B2C => succeeds
  const step2 = MarketingAnswersSchema.safeParse({ ...basePayload, marketType: "b2c", ageGroup: "age_18_24" });
  assert.strictEqual(step2.success, true);

  // 3. Founder switches to B2B and age is cleared/ignored => succeeds
  const step3 = MarketingAnswersSchema.safeParse({ ...basePayload, marketType: "b2b", ageGroup: undefined });
  assert.strictEqual(step3.success, true);

  // 4. Founder switches to Both and age is null => succeeds
  const step4 = MarketingAnswersSchema.safeParse({ ...basePayload, marketType: "both", ageGroup: null });
  assert.strictEqual(step4.success, true);

  // 5. Founder switches back to B2C without fresh age => fails again until selected
  const step5 = MarketingAnswersSchema.safeParse({ ...basePayload, marketType: "b2c", ageGroup: undefined });
  assert.strictEqual(step5.success, false);
});
