import { AlertCircle, Award, CheckCircle2, UserCheck } from "lucide-react";
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
  const baselineTier = data.questionnaireBaselineTier ?? data.ruleBaselineTier;
  const nlpTier = data.nlpSuggestedTier ?? data.literacyTier;

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
        <div className="flex flex-wrap items-center gap-2">
          {data.overriddenByUser && (
            <span className="flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800">
              <UserCheck className="size-3.5 text-amber-600" />
              Manual Override
            </span>
          )}
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

      {/* Heuristic Signal & Tier Decomposition Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Card 1: Heuristic Classification Signal (Uncalibrated) */}
        <div className="border-neutral-150 rounded-lg border bg-neutral-50/50 p-4">
          <span className="text-xs font-semibold text-neutral-600">
            {data.heuristicSignalLabel || "Heuristic Classification Signal"}
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-neutral-900">
              {Math.round(data.confidenceScore * 100)}%
            </span>
            <span className="text-xs text-neutral-500">relative heuristic signal</span>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-neutral-200">
            <div
              className={cn("h-full rounded-full", currentTier.bg)}
              style={{ width: `${Math.round(data.confidenceScore * 100)}%` }}
            />
          </div>
          <p className="mt-2 text-[11px] text-neutral-500 italic">
            Relative heuristic score, not a validated accuracy or calibrated posterior probability.
          </p>
        </div>

        {/* Card 2: Rule-Based Baseline vs NLP Fusion */}
        <div className="border-neutral-150 rounded-lg border bg-neutral-50/50 p-4">
          <span className="text-xs font-semibold text-neutral-600">
            Questionnaire Baseline vs NLP Model
          </span>
          <div className="mt-2 flex flex-col gap-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-neutral-500">Q10+Q11 Baseline:</span>
              <span className="font-semibold text-neutral-900 capitalize">{baselineTier}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-500">NLP Heuristic:</span>
              <span className="font-semibold text-neutral-900 capitalize">{nlpTier}</span>
            </div>
            <div className="flex items-center justify-between border-t border-neutral-200 pt-1 font-bold">
              <span className="text-neutral-700">Effective Messaging:</span>
              <span className={cn("capitalize", currentTier.text)}>{data.literacyTier}</span>
            </div>
          </div>
          <p className="mt-2 text-[11px] text-neutral-500">
            {data.overriddenByUser
              ? "Founder specified custom tier override for marketing copy."
              : baselineTier === nlpTier
                ? "✓ Complete alignment between Likert baseline and NLP text markers."
                : "NLP model adjusted baseline based on role and vocabulary context."}
          </p>
        </div>

        {/* Card 3: Relative Class Proportions */}
        <div className="border-neutral-150 rounded-lg border bg-neutral-50/50 p-4">
          <span className="text-xs font-semibold text-neutral-600">
            Relative Heuristic Distribution
          </span>
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

      {/* Explanatory Reason Codes */}
      <div className="border-neutral-150 rounded-lg border bg-neutral-50/40 p-4">
        <h4 className="text-xs font-bold text-neutral-700 uppercase">
          Classifier Explanation & Traceability
        </h4>
        <ul className="mt-2 space-y-1.5">
          {data.reasonCodes.map((code, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs text-neutral-600">
              <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-emerald-600" />
              <span>{code}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Research Transparency Callout */}
      <div className="flex items-start gap-2.5 rounded-lg border border-neutral-200 bg-neutral-50/60 p-3 text-xs text-neutral-600">
        <AlertCircle className="mt-0.5 size-4 shrink-0 text-neutral-400" />
        <p>
          <span className="font-semibold text-neutral-700">Methodology Note:</span>{" "}
          {data.uncertaintyCaveat}
        </p>
      </div>
    </div>
  );
}
