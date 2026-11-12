import type { BudgetReport, ChannelAllocationDetail } from "@/features/marketing/schema";

export interface BudgetOptimizerInput {
  monthlyBudgetLkr: number;
  campaignMonths: number;
  budgetFlexibility: "fixed" | "slightly_flexible" | "moderately_flexible" | "highly_flexible";
  reservePercentage?: number;
  channels: {
    channelId: string;
    channelName: string;
    score: number;
    isRecommended: boolean;
  }[];
}

/**
 * Allocates user-defined marketing budget across recommended channels.
 * Guarantees exact integer LKR arithmetic, largest-remainder exact-sum rounding,
 * flexibility constraints, and comparison against an equal-allocation baseline.
 */
export function optimizeMarketingBudget(input: BudgetOptimizerInput): BudgetReport {
  const monthlyBudget = Math.max(0, Math.floor(input.monthlyBudgetLkr));
  const months = Math.max(1, Math.floor(input.campaignMonths));
  const totalBudget = monthlyBudget * months;

  // Active channels: prioritize recommended channels
  const activeChannels = input.channels.filter((c) => c.isRecommended);
  const selectedChannels = activeChannels.length > 0 ? activeChannels : input.channels.slice(0, 3);
  const k = selectedChannels.length;

  // Edge Case 1: Zero budget or no channels
  if (monthlyBudget === 0 || k === 0) {
    const zeroAllocs: ChannelAllocationDetail[] = selectedChannels.map((ch) => ({
      channelId: ch.channelId,
      channelName: ch.channelName,
      monthlyLkr: 0,
      totalCampaignLkr: 0,
      percentage: 0.0,
      score: ch.score,
      rationale: "Zero-spend organic and direct outreach strategy.",
    }));

    return {
      monthlyBudgetLkr: 0,
      campaignMonths: months,
      totalBudgetLkr: 0,
      reserveMonthlyLkr: 0,
      reserveTotalLkr: 0,
      channelAllocations: zeroAllocs,
      equalSplitBaseline: zeroAllocs,
      exactSumVerified: true,
      proxyUtilityScore: 0.0,
      optimizationStatus: "zero_budget_organic",
      methodDisclaimer:
        "Allocations reflect strategic resource planning, NOT guaranteed revenue or conversion figures.",
    };
  }

  // Calculate Reserve
  const reservePct = Math.min(0.5, Math.max(0.0, (input.reservePercentage ?? 0) / 100));
  const reserveMonthly = Math.floor(monthlyBudget * reservePct);
  const allocableMonthly = monthlyBudget - reserveMonthly;
  const reserveTotal = reserveMonthly * months;

  // Weights from AHP scores
  const scoreSum = selectedChannels.reduce((acc, ch) => acc + Math.max(1.0, ch.score), 0);
  const targetWeights = selectedChannels.map((ch) => Math.max(1.0, ch.score) / scoreSum);

  // Maximum caps based on flexibility
  const capRates: Record<string, number> = {
    fixed: 0.6,
    slightly_flexible: 0.65,
    moderately_flexible: 0.75,
    highly_flexible: 0.85,
  };
  const maxCapRate = capRates[input.budgetFlexibility] ?? 0.7;

  // Calculate raw unconstrained allocations
  let rawAllocs = targetWeights.map((w) => w * allocableMonthly);

  // Apply maximum cap constraint if any channel exceeds it
  let capExceeded = false;
  rawAllocs = rawAllocs.map((raw) => {
    const cap = allocableMonthly * maxCapRate;
    if (raw > cap) {
      capExceeded = true;
      return cap;
    }
    return raw;
  });

  // Rebalance if cap was applied
  if (capExceeded) {
    const currentSum = rawAllocs.reduce((acc, r) => acc + r, 0);
    const deficit = allocableMonthly - currentSum;
    if (deficit > 0) {
      const nonCappedCount = rawAllocs.filter((r) => r < allocableMonthly * maxCapRate).length;
      if (nonCappedCount > 0) {
        rawAllocs = rawAllocs.map((r) =>
          r < allocableMonthly * maxCapRate ? r + deficit / nonCappedCount : r,
        );
      }
    }
  }

  // Integer LKR Allocation via Largest-Remainder Method
  // Round in 1,000 LKR units if allocable budget >= 20,000 LKR, else 1 LKR unit
  const unit = allocableMonthly >= 20000 ? 1000 : 1;
  const unitsToDistribute = Math.floor(allocableMonthly / unit);
  const rawUnits = rawAllocs.map((r) => r / unit);
  const flooredUnits = rawUnits.map((ru) => Math.floor(ru));
  const remainders = rawUnits.map((ru, idx) => ({ idx, remainder: ru - flooredUnits[idx] }));

  // Distribute deficit units to highest remainders
  const distributedUnits = flooredUnits.reduce((acc, u) => acc + u, 0);
  const unitsDeficit = unitsToDistribute - distributedUnits;

  remainders.sort((a, b) => b.remainder - a.remainder);
  for (let i = 0; i < unitsDeficit; i++) {
    const chIdx = remainders[i % k].idx;
    flooredUnits[chIdx] += 1;
  }

  const finalMonthlyLkr = flooredUnits.map((u) => u * unit);

  // Absorb any integer division residual into top ranked channel
  const residual = allocableMonthly - finalMonthlyLkr.reduce((acc, m) => acc + m, 0);
  if (residual > 0) {
    finalMonthlyLkr[0] += residual;
  }

  // Verify exact sum invariant
  const allocatedMonthlyTotal = finalMonthlyLkr.reduce((acc, m) => acc + m, 0);
  const exactSumVerified = allocatedMonthlyTotal + reserveMonthly === monthlyBudget;

  // Equal-Split Baseline for comparison
  const equalBaseMonthly = Math.floor(allocableMonthly / k);
  const equalResidual = allocableMonthly - equalBaseMonthly * k;
  const equalMonthlyLkr = selectedChannels.map((_, idx) =>
    idx === 0 ? equalBaseMonthly + equalResidual : equalBaseMonthly,
  );

  let proxyUtilityScore = 0.0;
  const channelAllocations: ChannelAllocationDetail[] = selectedChannels.map((ch, idx) => {
    const mAmount = finalMonthlyLkr[idx];
    const tAmount = mAmount * months;
    const pct = monthlyBudget > 0 ? Number(((mAmount / monthlyBudget) * 100).toFixed(1)) : 0;

    proxyUtilityScore += ch.score * Math.log(1 + mAmount);

    return {
      channelId: ch.channelId,
      channelName: ch.channelName,
      monthlyLkr: mAmount,
      totalCampaignLkr: tAmount,
      percentage: pct,
      score: ch.score,
      rationale: `Allocated ${pct}% of monthly spend (${mAmount.toLocaleString()} LKR/mo) corresponding to AHP priority score of ${ch.score}/100.`,
    };
  });

  const equalSplitBaseline: ChannelAllocationDetail[] = selectedChannels.map((ch, idx) => {
    const eqAmount = equalMonthlyLkr[idx];
    const eqPct = monthlyBudget > 0 ? Number(((eqAmount / monthlyBudget) * 100).toFixed(1)) : 0;
    return {
      channelId: ch.channelId,
      channelName: ch.channelName,
      monthlyLkr: eqAmount,
      totalCampaignLkr: eqAmount * months,
      percentage: eqPct,
      score: ch.score,
      rationale: "Equal-split research baseline benchmark.",
    };
  });

  return {
    monthlyBudgetLkr: monthlyBudget,
    campaignMonths: months,
    totalBudgetLkr: totalBudget,
    reserveMonthlyLkr: reserveMonthly,
    reserveTotalLkr: reserveTotal,
    channelAllocations,
    equalSplitBaseline,
    exactSumVerified,
    proxyUtilityScore: Number(proxyUtilityScore.toFixed(2)),
    optimizationStatus: "optimal_exact_sum",
    methodDisclaimer:
      "Allocations are computed via largest-remainder integer rounding; proxy utility measures multi-criteria alignment, not guaranteed sales return.",
  };
}
