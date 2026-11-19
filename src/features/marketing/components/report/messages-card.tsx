"use client";

import { useState } from "react";
import { Check, Copy, ShieldAlert, Sparkles, FileText } from "lucide-react";
import { toast } from "sonner";
import type { FeatureToValueReport } from "@/features/marketing/schema";
import { cn } from "@/lib/utils";

type Props = {
  data: FeatureToValueReport;
};

export function MessagesCard({ data }: Props) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<
    "recommended" | "simple" | "balanced" | "technical"
  >("recommended");

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const variants = [
    {
      id: "recommended",
      label: "Recommended Variant",
      text: data.recommendedMessage,
      badge: "Target Tier Alignment",
    },
    {
      id: "simple",
      label: "Plain / Non-Technical",
      text: data.simpleMessage,
      badge: "Low Jargon / Direct Outcome",
    },
    {
      id: "balanced",
      label: "Balanced Operational",
      text: data.balancedMessage,
      badge: "Workflow & Efficiency",
    },
    {
      id: "technical",
      label: "Technical / Engineering",
      text: data.technicalMessage,
      badge: "Grounded Features & Specs",
    },
  ];

  const activeVariant = variants.find((v) => v.id === selectedVariant) || variants[0];
  const isAi = data.isAiGenerated && data.generationSource !== "Template Fallback";

  return (
    <div className="flex flex-col gap-6 rounded-xl border border-neutral-200 bg-card p-6 shadow-xs">
      <div className="flex flex-col justify-between gap-4 border-b border-neutral-200 pb-4 sm:flex-row sm:items-center">
        <div>
          <span className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">
            FR4 Feature-to-Value Translation
          </span>
          <h3 className="mt-0.5 text-lg font-bold text-neutral-900">
            Customer-Oriented Marketing Messages
          </h3>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
              isAi
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-neutral-200 bg-neutral-100 text-neutral-700",
            )}
          >
            {isAi ? (
              <Sparkles className="size-3.5 text-emerald-600" />
            ) : (
              <FileText className="size-3.5 text-neutral-500" />
            )}
            {data.generationSource || (isAi ? "OpenAI" : "Template Fallback")}
          </span>
          <span className="text-xs text-neutral-400 font-mono hidden sm:inline">
            {data.generationModel}
          </span>
        </div>
      </div>

      {/* Core Value Proposition Quote */}
      <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-5">
        <span className="text-xs font-semibold tracking-wider text-emerald-800 uppercase">
          Core Value Proposition
        </span>
        <blockquote className="mt-1 text-base font-semibold text-emerald-950 italic">
          &ldquo;{data.coreValueProposition}&rdquo;
        </blockquote>
      </div>

      {/* Message Variants Switcher */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">
            Tailored Copy Variants
          </h4>
          <span className="text-xs text-neutral-500 italic">{data.rationale}</span>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {variants.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setSelectedVariant(v.id as typeof selectedVariant)}
              className={cn(
                "flex cursor-pointer flex-col items-start rounded-lg border p-3 text-left transition-colors",
                selectedVariant === v.id
                  ? "border-neutral-900 bg-neutral-900 text-white shadow-xs"
                  : "border-neutral-200 bg-card text-neutral-800 hover:bg-neutral-50",
              )}
            >
              <span className="text-xs leading-tight font-bold">{v.label}</span>
              <span
                className={cn(
                  "mt-1 text-[10px] leading-tight font-medium",
                  selectedVariant === v.id ? "text-neutral-300" : "text-neutral-500",
                )}
              >
                {v.badge}
              </span>
            </button>
          ))}
        </div>

        {/* Selected Variant Display Card */}
        <div className="group relative rounded-lg border border-neutral-200 bg-neutral-50/70 p-4">
          <p className="pr-8 text-sm leading-relaxed font-normal text-neutral-800">
            {activeVariant.text}
          </p>
          <button
            type="button"
            onClick={() => copyToClipboard(activeVariant.text, activeVariant.id)}
            className="absolute top-3 right-3 rounded-md p-1.5 text-neutral-400 hover:bg-neutral-200 hover:text-neutral-700"
            title="Copy to clipboard"
          >
            {copiedKey === activeVariant.id ? (
              <Check className="size-4 text-emerald-600" />
            ) : (
              <Copy className="size-4" />
            )}
          </button>
        </div>
      </div>

      {/* Feature to Benefit Decomposition Grid */}
      <div className="flex flex-col gap-3">
        <h4 className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">
          Feature-to-Benefit Mapping (FR4 Traceability)
        </h4>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {data.featureBenefitPairs.map((pair, idx) => (
            <div
              key={idx}
              className="border-neutral-150 flex flex-col justify-between rounded-lg border bg-card p-3.5"
            >
              <div>
                <span className="rounded bg-neutral-100 px-2 py-0.5 font-mono text-[11px] font-semibold text-neutral-700">
                  {pair.feature}
                </span>
                <p className="mt-2 text-xs leading-relaxed text-neutral-800">
                  {pair.benefitStatement}
                </p>
              </div>
              <div className="mt-3 border-t border-neutral-100 pt-2 text-[11px] text-neutral-500">
                <span className="font-medium text-neutral-700">Pain Point Addressed:</span>{" "}
                <span className="capitalize">{pair.targetConcernAddressed}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Campaign Assets: Headline, Social Caption, CTA */}
      <div className="border-neutral-150 rounded-lg border bg-neutral-50/50 p-4">
        <h4 className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">
          Ready-to-Use Campaign Assets
        </h4>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex flex-col justify-between rounded-md border border-neutral-200 bg-card p-3">
            <div>
              <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">
                Short Ad Headline
              </span>
              <p className="mt-1 text-xs font-bold text-neutral-900">{data.shortHeadline}</p>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(data.shortHeadline, "headline")}
              className="mt-2 flex items-center gap-1 self-start text-[11px] text-neutral-500 hover:text-neutral-900"
            >
              {copiedKey === "headline" ? (
                <Check className="size-3 text-emerald-600" />
              ) : (
                <Copy className="size-3" />
              )}
              Copy
            </button>
          </div>

          <div className="flex flex-col justify-between rounded-md border border-neutral-200 bg-card p-3">
            <div>
              <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">
                Social Caption
              </span>
              <p className="mt-1 text-xs text-neutral-800">{data.socialCaption}</p>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(data.socialCaption, "caption")}
              className="mt-2 flex items-center gap-1 self-start text-[11px] text-neutral-500 hover:text-neutral-900"
            >
              {copiedKey === "caption" ? (
                <Check className="size-3 text-emerald-600" />
              ) : (
                <Copy className="size-3" />
              )}
              Copy
            </button>
          </div>

          <div className="flex flex-col justify-between rounded-md border border-neutral-200 bg-card p-3">
            <div>
              <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">
                Recommended CTA
              </span>
              <p className="mt-1 text-xs font-bold text-neutral-900">{data.cta}</p>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(data.cta, "cta")}
              className="mt-2 flex items-center gap-1 self-start text-[11px] text-neutral-500 hover:text-neutral-900"
            >
              {copiedKey === "cta" ? (
                <Check className="size-3 text-emerald-600" />
              ) : (
                <Copy className="size-3" />
              )}
              Copy
            </button>
          </div>
        </div>
      </div>

      {/* Claim Warnings Callout */}
      {data.claimWarnings.length > 0 && (
        <div className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50/50 p-3.5 text-xs text-amber-900">
          <ShieldAlert className="mt-0.5 size-4 shrink-0 text-amber-600" />
          <div className="flex flex-col gap-1">
            <span className="font-bold">Sri Lankan Marketing Claim Verification:</span>
            <ul className="list-disc space-y-0.5 pl-4 text-amber-800">
              {data.claimWarnings.map((warning, idx) => (
                <li key={idx}>{warning}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
