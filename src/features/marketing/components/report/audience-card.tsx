import { AlertTriangle, Award, CheckCircle2 } from "lucide-react";
import type { AudienceIntelligenceReport } from "@/features/marketing/schema";
import { cn } from "@/lib/utils";

type Props = {
  data: AudienceIntelligenceReport;
};

export function AudienceCard({ data }: Props) {
  const tierColors: Record<string, { badge: string; text: string; bg: string }> = {
    low: {
      badge: "bg-blue-100 text-blue-800 border-blue-200",
      text: "text-blue-700",
      bg: "bg-blue-500",
    },
    medium: {
      badge: "bg-emerald-100 text-emerald-800 border-emerald-200",
      text: "text-emerald-700",
      bg: "bg-emerald-500",
    },
    high: {
      badge: "bg-purple-100 text-purple-800 border-purple-200",
      text: "text-purple-700",
      bg: "bg-purple-500",
    },
  };

  const currentTier = tierColors[data.literacyTier] || tierColors.medium;

  return (
    <div className="flex flex-col gap-6 rounded-xl border border-neutral-200 bg-card p-6 shadow-xs">
      <div className="flex flex-col justify-between gap-4 border-b border-neutral-200 pb-4 sm:flex-row sm:items-center">
        <div>
          <span className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">
            FR3 Audience Intelligence
          </span>
          <h3 className="mt-0.5 text-lg font-bold text-neutral-900">
            Target Audience Technical Literacy Analysis
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold capitalize",
              currentTier.badge,
            )}
          >
            <Award className="size-3.5" />
            {data.literacyTier} Technical Literacy
          </span>
        </div>
      </div>

      {/* Probabilities & Confidence Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="border-neutral-150 rounded-lg border bg-neutral-50/50 p-4">
          <span className="text-xs text-neutral-500">Confidence Calibration</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-neutral-900">
              {Math.round(data.confidenceScore * 100)}%
            </span>
            <span className="text-xs text-neutral-500">posterior probability</span>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-neutral-200">
            <div
              className={cn("h-full rounded-full", currentTier.bg)}
              style={{ width: `${Math.round(data.confidenceScore * 100)}%` }}
            />
          </div>
        </div>

        <div className="border-neutral-150 rounded-lg border bg-neutral-50/50 p-4">
          <span className="text-xs text-neutral-500">Rule-Based Heuristic Baseline</span>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-2xl font-bold text-neutral-900 capitalize">
              {data.ruleBaselineTier}
            </span>
            <span className="rounded-full bg-neutral-200 px-2 py-0.5 text-xs font-medium text-neutral-700">
              Q10+Q11 Sum
            </span>
          </div>
          <p className="mt-2 text-xs text-neutral-500">
            {data.ruleBaselineTier === data.literacyTier
              ? "✓ Agreement between NLP fusion and rule baseline"
              : "NLP model updated baseline based on role and text markers"}
          </p>
        </div>

        <div className="border-neutral-150 rounded-lg border bg-neutral-50/50 p-4">
          <span className="text-xs text-neutral-500">Probability Distribution</span>
          <div className="mt-2 flex flex-col gap-1.5">
            {Object.entries(data.probabilities).map(([tier, prob]) => (
              <div key={tier} className="flex items-center justify-between text-xs">
                <span className="font-medium text-neutral-600 capitalize">{tier}:</span>
                <span className="font-mono text-neutral-900">{Math.round(prob * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Evidentiary Reason Codes */}
      <div className="flex flex-col gap-2">
        <h4 className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">
          Classification Signals & Evidence
        </h4>
        <ul className="space-y-1.5">
          {data.reasonCodes.map((reason, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs text-neutral-700">
              <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-emerald-600" />
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Uncertainty Caveat */}
      <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50/60 p-3.5 text-xs text-amber-900">
        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600" />
        <div>
          <span className="font-semibold">Research Methodology Notice:</span>{" "}
          {data.uncertaintyCaveat}{" "}
          <span className="italic">(Classification engine: {data.modelType})</span>
        </div>
      </div>
    </div>
  );
}
