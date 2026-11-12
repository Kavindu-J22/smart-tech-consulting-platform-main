import test from "node:test";
import assert from "node:assert";
import { optimizeMarketingBudget } from "@/features/marketing/engine/budget";

const sampleChannels = [
  { channelId: "linkedin", channelName: "LinkedIn", score: 88.5, isRecommended: true },
  { channelId: "google_ads", channelName: "Google Ads", score: 82.0, isRecommended: true },
  { channelId: "website_seo", channelName: "Website & SEO", score: 76.0, isRecommended: true },
  { channelId: "facebook", channelName: "Facebook", score: 65.0, isRecommended: false },
];

test("optimizeMarketingBudget - exact sum invariant verification with standard budget", () => {
  const monthly = 50000;
  const months = 3;
  const result = optimizeMarketingBudget({
    monthlyBudgetLkr: monthly,
    campaignMonths: months,
    budgetFlexibility: "moderately_flexible",
    reservePercentage: 10, // 10% reserve = 5,000 LKR
    channels: sampleChannels,
  });

  assert.strictEqual(result.exactSumVerified, true);
  assert.strictEqual(result.monthlyBudgetLkr, monthly);
  assert.strictEqual(result.totalBudgetLkr, monthly * months);
  assert.strictEqual(result.reserveMonthlyLkr, 5000);

  // Sum of channels + reserve must equal monthly budget EXACTLY
  const channelMonthlySum = result.channelAllocations.reduce((acc, c) => acc + c.monthlyLkr, 0);
  assert.strictEqual(channelMonthlySum + result.reserveMonthlyLkr, monthly);

  // Total campaign sum check
  const channelTotalSum = result.channelAllocations.reduce((acc, c) => acc + c.totalCampaignLkr, 0);
  assert.strictEqual(channelTotalSum + result.reserveTotalLkr, monthly * months);
});

test("optimizeMarketingBudget - largest-remainder 1000 LKR rounding for budgets >= 20,000 LKR", () => {
  const result = optimizeMarketingBudget({
    monthlyBudgetLkr: 75000,
    campaignMonths: 6,
    budgetFlexibility: "fixed",
    reservePercentage: 0,
    channels: sampleChannels,
  });

  assert.strictEqual(result.exactSumVerified, true);
  for (const alloc of result.channelAllocations) {
    assert.strictEqual(
      alloc.monthlyLkr % 1000,
      0,
      `Channel ${alloc.channelId} monthly amount ${alloc.monthlyLkr} should be a multiple of 1,000 LKR`,
    );
  }
});

test("optimizeMarketingBudget - zero budget edge case handled cleanly", () => {
  const result = optimizeMarketingBudget({
    monthlyBudgetLkr: 0,
    campaignMonths: 3,
    budgetFlexibility: "fixed",
    channels: sampleChannels,
  });

  assert.strictEqual(result.monthlyBudgetLkr, 0);
  assert.strictEqual(result.totalBudgetLkr, 0);
  assert.strictEqual(result.exactSumVerified, true);
  for (const alloc of result.channelAllocations) {
    assert.strictEqual(alloc.monthlyLkr, 0);
    assert.strictEqual(alloc.totalCampaignLkr, 0);
  }
});

test("optimizeMarketingBudget - equal split baseline benchmark computed accurately", () => {
  const result = optimizeMarketingBudget({
    monthlyBudgetLkr: 60000,
    campaignMonths: 2,
    budgetFlexibility: "fixed",
    channels: sampleChannels,
  });

  // 3 recommended channels -> 20,000 LKR each in baseline
  assert.strictEqual(result.equalSplitBaseline.length, 3);
  const baselineSum = result.equalSplitBaseline.reduce((acc, c) => acc + c.monthlyLkr, 0);
  assert.strictEqual(baselineSum, 60000);

  // AHP prioritizes LinkedIn (highest score 88.5) over Website & SEO (76.0)
  const linkedInAlloc = result.channelAllocations.find((c) => c.channelId === "linkedin");
  const seoAlloc = result.channelAllocations.find((c) => c.channelId === "website_seo");
  assert.ok(
    (linkedInAlloc?.monthlyLkr ?? 0) > (seoAlloc?.monthlyLkr ?? 0),
    "Higher AHP score channel must receive higher or equal budget than lower scoring channel",
  );
});
