import { Flame, Scale } from "lucide-react";
import type { AHPReport } from "@/features/marketing/schema";
import { cn } from "@/lib/utils";

type Props = {
  data: AHPReport;
};

export function AHPCard({ data }: Props) {
  const criteriaLabels: Record<string, string> = {
    audience_fit: "Audience Fit (34%)",
    objective_fit: "Goal Fit (25%)",
    cost_suitability: "Cost Fit (18%)",
    reach_fit: "Reach Fit (13%)",
    content_fit: "Content Fit (10%)",
  };

  return (
    <div className="flex flex-col gap-6 rounded-xl border border-neutral-200 bg-card p-6 shadow-xs">
      <div className="flex flex-col justify-between gap-4 border-b border-neutral-200 pb-4 sm:flex-row sm:items-center">
        <div>
          <span className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">
            FR5 Analytical Hierarchy Process (AHP)
          </span>
          <h3 className="mt-0.5 text-lg font-bold text-neutral-900">
            Multi-Criteria Marketing Channel Suitability Rankings
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold",
              data.isConsistent
                ? "border-emerald-200 bg-emerald-100 text-emerald-800"
                : "border-amber-200 bg-amber-100 text-amber-800",
            )}
          >
            <Scale className="size-3.5" />
            CR = {data.consistencyRatio.toFixed(3)} (
            {data.isConsistent ? "Consistent Matrix ≤ 0.10" : "Inconsistent"})
          </span>
        </div>
      </div>

      {/* AHP Criteria Weights Diagnostics Bar */}
      <div className="border-neutral-150 rounded-lg border bg-neutral-50/60 p-4">
        <div className="mb-3 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <span className="text-xs font-semibold tracking-wider text-neutral-700 uppercase">
            Synthesized AHP Criteria Priorities
          </span>
          <span className="font-mono text-xs text-neutral-500">
            Weight Version: {data.weightVersion}{" "}
            {data.isAssumedWeights && "(Pre-calibrated Sri Lankan Model)"}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {Object.entries(data.criteriaWeights).map(([crit, w]) => (
            <div
              key={crit}
              className="rounded-md border border-neutral-200 bg-card p-2 text-center"
            >
              <span className="block truncate text-[11px] font-medium text-neutral-500">
                {criteriaLabels[crit] || crit}
              </span>
              <span className="font-mono text-sm font-bold text-neutral-900">
                {Math.round(w * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Ranked Channels Table */}
      <div className="overflow-x-auto rounded-lg border border-neutral-200">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-neutral-200 bg-neutral-100 font-semibold text-neutral-700">
            <tr>
              <th className="w-12 px-3 py-2.5 text-center">Rank</th>
              <th className="px-3 py-2.5">Channel</th>
              <th className="px-3 py-2.5">AHP Score</th>
              <th className="px-3 py-2.5">Criteria Score Contribution</th>
              <th className="px-3 py-2.5">Status</th>
              <th className="px-3 py-2.5">Strategic Rationale</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 bg-card">
            {data.rankedChannels.map((ch) => (
              <tr
                key={ch.channelId}
                className={cn("hover:bg-neutral-50/50", ch.isRecommended && "bg-emerald-50/20")}
              >
                <td className="px-3 py-3 text-center font-bold">
                  <span
                    className={cn(
                      "inline-flex size-6 items-center justify-center rounded-full text-xs font-bold",
                      ch.rank === 1
                        ? "bg-amber-400 font-extrabold text-neutral-950"
                        : ch.rank === 2
                          ? "bg-neutral-300 text-neutral-900"
                          : ch.rank === 3
                            ? "bg-amber-200 text-amber-950"
                            : "bg-neutral-100 text-neutral-600",
                    )}
                  >
                    {ch.rank}
                  </span>
                </td>
                <td className="px-3 py-3 font-bold text-neutral-900">
                  <div className="flex flex-col">
                    <span>{ch.channelName}</span>
                    <span className="text-[10px] font-normal text-neutral-500">
                      Reach: {Math.round(ch.reachRate * 100)}% Sri Lankan digital users
                    </span>
                  </div>
                </td>
                <td className="px-3 py-3 font-mono text-sm font-bold text-neutral-900">
                  {ch.score.toFixed(1)}
                  <span className="text-[10px] font-normal text-neutral-400">/100</span>
                </td>
                <td className="px-3 py-3">
                  <div className="flex max-w-xs flex-wrap gap-1">
                    {Object.entries(ch.criterionContributions).map(([c, val]) => (
                      <span
                        key={c}
                        className="rounded-sm bg-neutral-100 px-1.5 py-0.5 font-mono text-[10px] text-neutral-700"
                        title={`${c}: ${val} pts`}
                      >
                        {c.replace(/_fit|_suitability/g, "")}: {val}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-3 py-3">
                  {ch.isRecommended ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
                      <Flame className="size-3 text-emerald-600" />
                      Recommended
                    </span>
                  ) : (
                    <span className="rounded-full border border-neutral-200 bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-600">
                      Secondary
                    </span>
                  )}
                </td>
                <td className="max-w-sm px-3 py-3 text-xs text-neutral-700">{ch.rationale}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Baseline Comparison Box */}
      <div className="border-neutral-150 flex flex-col items-start justify-between gap-4 rounded-lg border bg-neutral-50/50 p-4 text-xs sm:flex-row sm:items-center">
        <div>
          <span className="font-semibold text-neutral-900">
            Research Baseline Channel Comparison:
          </span>
          <p className="mt-0.5 text-neutral-600">
            Rule-based baseline heuristic selected:{" "}
            <span className="font-bold text-neutral-800">
              {data.ruleBaselineChannels.join(", ")}
            </span>
            . AHP expands this by weighting local reach, objective alignment, and content format
            overlap.
          </p>
        </div>
        <div className="shrink-0 text-[11px] text-neutral-500 italic">{data.methodDisclaimer}</div>
      </div>
    </div>
  );
}
