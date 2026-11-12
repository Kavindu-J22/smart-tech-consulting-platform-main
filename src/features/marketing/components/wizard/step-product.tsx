"use client";

import { Controller, type Control, type FieldErrors, type UseFormRegister } from "react-hook-form";
import { FieldGroup } from "@/components/ui/field";
import { TextField } from "@/components/shared/text-field";
import { TextareaField } from "@/components/shared/textarea-field";
import { ChoiceField } from "@/components/shared/choice-field";
import { MARKETING_INDUSTRIES, MARKETING_INDUSTRY_LABELS } from "@/features/marketing/options";
import type { MarketingAnswers } from "@/features/marketing/schema";

type Props = {
  register: UseFormRegister<MarketingAnswers>;
  control: Control<MarketingAnswers>;
  errors: FieldErrors<MarketingAnswers>;
};

export function StepProduct({ register, control, errors }: Props) {
  return (
    <FieldGroup>
      <div className="border-neutral-150 mb-2 rounded-lg border bg-neutral-50/50 p-4">
        <h3 className="text-sm font-semibold text-neutral-900">
          Section A: Product & Technical Architecture (Q1–Q4)
        </h3>
        <p className="mt-0.5 text-xs text-neutral-500">
          Provide accurate product details. These will anchor your customer value translations and
          feature-benefit mappings without hallucinations.
        </p>
      </div>

      <TextField
        id="productName"
        label="Q1: What is the name of your product or digital service?"
        placeholder="e.g. LankaPay Ledger, PayPulse, AgroTrack LK"
        error={errors.productName}
        {...register("productName")}
      />

      <TextareaField
        id="productDescription"
        label="Q2: Briefly describe your product or service"
        placeholder="Explain what your product does, who it serves, and the underlying technologies used..."
        error={errors.productDescription}
        {...register("productDescription")}
      />

      <TextareaField
        id="mainFeatures"
        label="Q3: What are the main features of your product?"
        placeholder="List key features (e.g. Automated reconciliation, Real-time SMS alerts, Role-based dashboard, Sinhala/Tamil support)..."
        error={errors.mainFeatures}
        {...register("mainFeatures")}
      />

      <Controller
        name="industry"
        control={control}
        render={({ field }) => (
          <ChoiceField
            name="industry"
            label="Q4: What industry does your product belong to?"
            ids={MARKETING_INDUSTRIES}
            labels={MARKETING_INDUSTRY_LABELS}
            value={field.value}
            onChange={field.onChange}
            error={errors.industry}
          />
        )}
      />
    </FieldGroup>
  );
}
