"use client";

import { useState } from "react";
import { Check, Copy, ShieldAlert, Sparkles } from "lucide-react";
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
      badge: "Best Fit for Audience",
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
      badge: "Specs & Cloud Architecture",
    },
  ];

  const activeVariant = variants.find((v) => v.id === selectedVariant) || variants[0];

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
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700">
            <Sparkles className="size-3.5 text-neutral-500" />
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
            className="absolute top-3 right-3 cursor-pointer rounded-md p-1.5 text-neutral-600 transition-colors hover:bg-neutral-200"
            title="Copy message"
          >
            {copiedKey === activeVariant.id ? (
              <Check className="size-4 text-emerald-600" />
            ) : (
              <Copy className="size-4" />
            )}
          </button>
        </div>
      </div>

      {/* Marketing Assets: Headline, Social Caption, CTA */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="border-neutral-150 rounded-lg border bg-card p-4">
          <span className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">
            Short Headline
          </span>
          <p className="mt-1 text-sm font-bold text-neutral-900">{data.shortHeadline}</p>
        </div>

        <div className="border-neutral-150 rounded-lg border bg-card p-4">
          <span className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">
            Call to Action (CTA)
          </span>
          <p className="mt-1 text-sm font-bold text-emerald-700">{data.cta}</p>
        </div>

        <div className="border-neutral-150 rounded-lg border bg-card p-4">
          <span className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">
            Social Caption
          </span>
          <p className="mt-1 line-clamp-2 text-xs text-neutral-700">{data.socialCaption}</p>
        </div>
      </div>

      {/* Feature-to-Benefit Mapping Table */}
      <div className="flex flex-col gap-3">
        <h4 className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">
          Feature-to-Value Mapping Matrix
        </h4>
        <div className="overflow-x-auto rounded-lg border border-neutral-200">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-neutral-200 bg-neutral-100 font-semibold text-neutral-700">
              <tr>
                <th className="px-3 py-2.5">Technical Feature (Input)</th>
                <th className="px-3 py-2.5">Substantiated Benefit (Output)</th>
                <th className="px-3 py-2.5">Target Customer Need</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 bg-card">
              {data.featureBenefitPairs.map((pair, idx) => (
                <tr key={idx} className="hover:bg-neutral-50/50">
                  <td className="px-3 py-2.5 font-medium text-neutral-900">{pair.feature}</td>
                  <td className="px-3 py-2.5 text-neutral-700">{pair.benefitStatement}</td>
                  <td className="px-3 py-2.5 text-neutral-600 capitalize">
                    {pair.targetConcernAddressed}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hallucination Guardrails & Verification Warnings */}
      {data.claimWarnings.length > 0 && (
        <div className="flex flex-col gap-1.5 rounded-lg border border-amber-200 bg-amber-50/50 p-4 text-xs text-amber-900">
          <div className="flex items-center gap-2 font-semibold text-amber-950">
            <ShieldAlert className="size-4 text-amber-700" />
            Verification Guardrails & Compliance Check
          </div>
          <ul className="list-disc space-y-1 pl-5 text-amber-900">
            {data.claimWarnings.map((warn, idx) => (
              <li key={idx}>{warn}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
