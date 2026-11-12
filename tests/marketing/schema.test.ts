import test from "node:test";
import assert from "node:assert";
import { MarketingAnswersSchema } from "@/features/marketing/schema";

test("MarketingAnswersSchema - validates complete Q1-Q21 response payload", () => {
  const validPayload = {
    productName: "LankaCloud ERP",
    productDescription: "Enterprise cloud software for managing multi-branch retail inventories.",
    mainFeatures:
      "Barcode scanning, Multi-currency ledgers, Automated GST reports, Sinhala language POS",
    industry: "saas",
    primaryTargetCustomer: "Mid-sized supermarket owners and retail branch accountants in Colombo.",
    marketType: "b2b",
    ageGroup: "age_35_44",
    customerRole: "business_owner",
    audienceLocation: "western_province",
    techComfort: "comfort_3",
    techTermsFamiliarity: "terms_3",
    messageDetailPreference: "detail_3",
    keyCustomerBenefit: "Eliminates stock discrepancies and reduces month-end audit delays by 80%.",
    customerPainPoints: ["saves_time", "reduces_errors"],
    channelsCurrentlyUsed: ["facebook", "website_seo"],
    channelsWorkingBest: ["website_seo"],
    preferredContent: ["product_demos", "case_studies"],
    monthlyBudgetLkr: 75000,
    budgetFlexibility: "moderately_flexible",
    campaignDuration: "duration_6m",
    campaignGoals: ["leads", "sales"],
    reservePercentage: 10,
  };

  const parsed = MarketingAnswersSchema.safeParse(validPayload);
  assert.strictEqual(parsed.success, true);
});

test("MarketingAnswersSchema - rejects negative budget and missing fields", () => {
  const invalidPayload = {
    productName: "A", // too short (min 2)
    monthlyBudgetLkr: -5000, // negative budget
    customerPainPoints: [], // min 1
  };

  const parsed = MarketingAnswersSchema.safeParse(invalidPayload);
  assert.strictEqual(parsed.success, false);
  if (!parsed.success) {
    const errorPaths = parsed.error.issues.map((i) => i.path[0]);
    assert.ok(errorPaths.includes("productName"));
    assert.ok(errorPaths.includes("monthlyBudgetLkr"));
    assert.ok(errorPaths.includes("customerPainPoints"));
  }
});
