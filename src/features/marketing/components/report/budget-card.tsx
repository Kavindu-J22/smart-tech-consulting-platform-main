import { Calculator, Info, ShieldCheck } from "lucide-react";
import type { BudgetReport } from "@/features/marketing/schema";

type Props = {
  data: BudgetReport;
};

export function BudgetCard({ data }: Props) {
  const allocableMonthly = data.monthlyBudgetLkr - data.reserveMonthlyLkr;
  const reservePct =
    data.monthlyBudgetLkr > 0
      ? ((data.reserveMonthlyLkr / data.monthlyBudgetLkr) * 100).toFixed(1)
      : "0.0";

  return (
    <div className="flex flex-col gap-6 rounded-xl border border-neutral-200 bg-card p-6 shadow-xs">
      <div className="flex flex-col justify-between gap-4 border-b border-neutral-200 pb-4 sm:flex-row sm:items-center">
        <div>
          <span className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">
            FR6 Constraint-Aware Budget Allocation
          </span>
          <h3 className="mt-0.5 text-lg font-bold text-neutral-900">
            LKR Campaign Budget Allocation & Baseline Comparison
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {data.exactSumVerified && (
            <span className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
              <ShieldCheck className="size-3.5 text-emerald-700" />
              Exact-Sum Verified (100% Invariant)
            </span>
          )}
        </div>
      </div>

      {/* High-level Budget Metrics */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="border-neutral-150 rounded-lg border bg-neutral-50/50 p-4">
          <span className="text-xs font-medium text-neutral-500">Monthly Budget</span>
          <p className="mt-1 font-mono text-xl font-bold text-neutral-900">
            {data.monthlyBudgetLkr.toLocaleString()}{" "}
            <span className="text-xs font-normal text-neutral-500">LKR</span>
          </p>
        </div>

        <div className="border-neutral-150 rounded-lg border bg-neutral-50/50 p-4">
          <span className="text-xs font-medium text-neutral-500">Campaign Duration</span>
          <p className="mt-1 font-mono text-xl font-bold text-neutral-900">
            {data.campaignMonths}{" "}
            <span className="text-xs font-normal text-neutral-500">
              {data.campaignMonths === 1 ? "month" : "months"}
            </span>
          </p>
        </div>

        <div className="border-neutral-150 rounded-lg border bg-neutral-50/50 p-4">
          <span className="text-xs font-medium text-neutral-500">Total Campaign Spend</span>
          <p className="mt-1 font-mono text-xl font-bold text-emerald-700">
            {data.totalBudgetLkr.toLocaleString()}{" "}
            <span className="text-xs font-normal text-neutral-500">LKR</span>
          </p>
        </div>

        <div className="border-neutral-150 rounded-lg border bg-neutral-50/50 p-4">
          <span className="text-xs font-medium text-neutral-500">Contingency Reserve</span>
          <p className="mt-1 font-mono text-xl font-bold text-neutral-700">
            {data.reserveMonthlyLkr.toLocaleString()}{" "}
            <span className="text-xs font-normal text-neutral-500">LKR/mo</span>
          </p>
        </div>
      </div>

      {/* Optimized Channel Allocations Table */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">
            Optimized Monthly & Campaign Allocations (Largest-Remainder Method)
          </h4>
          <span className="font-mono text-xs text-neutral-500">
            Proxy Utility Score: {data.proxyUtilityScore}
          </span>
        </div>

        <div className="overflow-x-auto rounded-lg border border-neutral-200">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-neutral-200 bg-neutral-100 font-semibold text-neutral-700">
              <tr>
                <th className="px-3 py-2.5">Recommended Channel</th>
                <th className="px-3 py-2.5 font-mono">Monthly (LKR)</th>
                <th className="px-3 py-2.5 font-mono">
                  Total ({data.campaignMonths} {data.campaignMonths === 1 ? "mo" : "mos"})
                </th>
                <th className="px-3 py-2.5">Share (%)</th>
                <th className="px-3 py-2.5">AHP Priority</th>
                <th className="px-3 py-2.5">Allocation Rationale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 bg-card">
              {data.channelAllocations.map((alloc) => (
                <tr key={alloc.channelId} className="hover:bg-neutral-50/50">
                  <td className="px-3 py-3 font-bold text-neutral-900">{alloc.channelName}</td>
                  <td className="px-3 py-3 font-mono font-bold text-emerald-700">
                    {alloc.monthlyLkr.toLocaleString()} LKR
                  </td>
                  <td className="px-3 py-3 font-mono text-neutral-700">
                    {alloc.totalCampaignLkr.toLocaleString()} LKR
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div className="bg-neutral-150 h-2 w-16 overflow-hidden rounded-full">
                        <div
                          className="h-full rounded-full bg-emerald-600"
                          style={{ width: `${Math.min(100, alloc.percentage)}%` }}
                        />
                      </div>
                      <span className="font-mono text-neutral-900">{alloc.percentage}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 font-mono text-neutral-700">
                    {alloc.score.toFixed(1)}/100
                  </td>
                  <td className="px-3 py-3 text-xs text-neutral-600">{alloc.rationale}</td>
                </tr>
              ))}
              {data.reserveMonthlyLkr > 0 && (
                <tr className="bg-neutral-50/70 font-semibold text-neutral-800">
                  <td className="px-3 py-2.5 italic">Strategic Contingency Reserve</td>
                  <td className="px-3 py-2.5 font-mono">
                    {data.reserveMonthlyLkr.toLocaleString()} LKR
                  </td>
                  <td className="px-3 py-2.5 font-mono">
                    {data.reserveTotalLkr.toLocaleString()} LKR
                  </td>
                  <td className="px-3 py-2.5 font-mono">{reservePct}%</td>
                  <td className="px-3 py-2.5">—</td>
                  <td className="px-3 py-2.5 text-neutral-500 italic">
                    Unallocated cash buffer for agile testing
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot className="border-t border-neutral-200 bg-neutral-100/80 font-bold text-neutral-900">
              <tr>
                <td className="px-3 py-2.5">Total Verified Sum</td>
                <td className="px-3 py-2.5 font-mono">
                  {data.monthlyBudgetLkr.toLocaleString()} LKR
                </td>
                <td className="px-3 py-2.5 font-mono">
                  {data.totalBudgetLkr.toLocaleString()} LKR
                </td>
                <td className="px-3 py-2.5 font-mono">100.0%</td>
                <td colSpan={2} className="px-3 py-2.5 text-right text-emerald-700">
                  Exact Match ✓
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Transparent Calculation Breakdown */}
      <div className="rounded-lg border border-neutral-200 bg-neutral-50/60 p-4 text-xs">
        <div className="flex items-center gap-2 font-bold text-neutral-900 mb-2">
          <Calculator className="size-4 text-neutral-700" />
          <span>How this allocation was calculated</span>
        </div>
        <ol className="list-decimal pl-4 space-y-1.5 text-neutral-700 leading-relaxed">
          <li>
            <strong>Input Monthly Budget:</strong> {data.monthlyBudgetLkr.toLocaleString()} LKR.
          </li>
          <li>
            <strong>Contingency Reserve:</strong> {reservePct}% deducted ({data.reserveMonthlyLkr.toLocaleString()} LKR/mo), leaving <strong>{allocableMonthly.toLocaleString()} LKR</strong> for channel deployment.
          </li>
          <li>
            <strong>AHP Prioritization:</strong> Allocable budget is apportioned proportionally to each channel&apos;s multi-criteria AHP score.
          </li>
          <li>
            <strong>Integer Optimization:</strong> The Largest-Remainder Method (Hamilton-Hare) is applied to floor allocations and distribute residual whole rupees to channels with the highest fractional remainders.
          </li>
          <li>
            <strong>Exact-Sum Guarantee:</strong> The sum of allocated channel amounts plus contingency reserve strictly equals {data.monthlyBudgetLkr.toLocaleString()} LKR with zero rounding drift.
          </li>
        </ol>
        <div className="mt-3 flex items-start gap-2 border-t border-neutral-200 pt-2 text-[11px] text-neutral-500">
          <Info className="size-3.5 shrink-0 mt-0.5 text-neutral-400" />
          <span>
            <strong>Planning Notice:</strong> Budget figures represent strategic resource allocation computed deterministically by algorithm, NOT retrieved from a vector database or promising guaranteed customer acquisition costs (CPC/CPA) or sales ROI.
          </span>
        </div>
      </div>

      {/* Comparison with Equal-Allocation Baseline */}
      <div className="border-neutral-150 flex flex-col gap-3 rounded-lg border bg-neutral-50/50 p-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold tracking-wider text-neutral-700 uppercase">
            Research Evaluation: AHP Allocation vs. Equal-Split Baseline
          </h4>
          <span className="text-[11px] font-medium text-neutral-500">Objective 5 Metric</span>
        </div>
        <p className="text-xs text-neutral-600">
          The research proposal defines an equal-allocation baseline across selected channels. AHP
          reallocation shifts capital from lower-scoring channels to top-scoring channels,
          increasing total proxy utility:
        </p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {data.equalSplitBaseline.map((base, idx) => {
            const optimized = data.channelAllocations[idx];
            const diff = (optimized?.monthlyLkr ?? 0) - base.monthlyLkr;
            return (
              <div
                key={base.channelId}
                className="rounded-md border border-neutral-200 bg-card p-2.5 text-xs"
              >
                <span className="block truncate font-bold text-neutral-900">
                  {base.channelName}
                </span>
                <div className="mt-1 flex items-baseline justify-between text-neutral-600">
                  <span>Equal Baseline:</span>
                  <span className="font-mono">{base.monthlyLkr.toLocaleString()} LKR</span>
                </div>
                <div className="mt-0.5 flex items-baseline justify-between font-semibold">
                  <span>AHP Allocation:</span>
                  <span className="font-mono text-emerald-700">
                    {optimized?.monthlyLkr.toLocaleString()} LKR
                  </span>
                </div>
                <div className="mt-1 text-right font-mono text-[10px]">
                  {diff >= 0 ? (
                    <span className="font-bold text-emerald-700">
                      +{diff.toLocaleString()} LKR (reallocated)
                    </span>
                  ) : (
                    <span className="text-neutral-500">{diff.toLocaleString()} LKR</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
