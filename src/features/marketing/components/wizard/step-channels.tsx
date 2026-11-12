"use client";

import { Controller, type Control, type FieldErrors, type UseFormRegister } from "react-hook-form";
import { FieldGroup } from "@/components/ui/field";
import { TextareaField } from "@/components/shared/textarea-field";
import { CheckboxField } from "@/components/shared/checkbox-field";
import {
  CONTENT_TYPES,
  CONTENT_TYPE_LABELS,
  CUSTOMER_PAIN_POINTS,
  CUSTOMER_PAIN_POINT_LABELS,
  MARKETING_CHANNELS,
  MARKETING_CHANNEL_LABELS,
} from "@/features/marketing/options";
import type { MarketingAnswers } from "@/features/marketing/schema";

type Props = {
  register: UseFormRegister<MarketingAnswers>;
  control: Control<MarketingAnswers>;
  errors: FieldErrors<MarketingAnswers>;
};

export function StepChannels({ register, control, errors }: Props) {
  return (
    <FieldGroup>
      <div className="border-neutral-150 mb-2 rounded-lg border bg-neutral-50/50 p-4">
        <h3 className="text-sm font-semibold text-neutral-900">
          Section D: Value Proposition & Channel Engagement (Q13–Q17)
        </h3>
        <p className="mt-0.5 text-xs text-neutral-500">
          Define customer value outcomes and current marketing channels. These inputs drive the AHP
          channel suitability matrix and feature translation.
        </p>
      </div>

      <TextareaField
        id="keyCustomerBenefit"
        label="Q13: What is the main benefit you want customers to understand about your product?"
        placeholder="State the core transformation (e.g. Cuts month-end accounting reconciliation time from 3 days to 15 minutes)..."
        error={errors.keyCustomerBenefit}
        {...register("keyCustomerBenefit")}
      />

      <Controller
        name="customerPainPoints"
        control={control}
        render={({ field }) => (
          <CheckboxField
            name="customerPainPoints"
            label="Q14: What are the main customer pain points your product solves? (Select all that apply)"
            ids={CUSTOMER_PAIN_POINTS}
            labels={CUSTOMER_PAIN_POINT_LABELS}
            value={field.value}
            onChange={field.onChange}
            error={errors.customerPainPoints}
          />
        )}
      />

      <Controller
        name="channelsCurrentlyUsed"
        control={control}
        render={({ field }) => (
          <CheckboxField
            name="channelsCurrentlyUsed"
            label="Q15: Which marketing channels are you currently using?"
            ids={MARKETING_CHANNELS}
            labels={MARKETING_CHANNEL_LABELS}
            value={field.value}
            onChange={field.onChange}
            error={errors.channelsCurrentlyUsed}
          />
        )}
      />

      <Controller
        name="channelsWorkingBest"
        control={control}
        render={({ field }) => (
          <CheckboxField
            name="channelsWorkingBest"
            label="Q16: Which marketing channels have worked best for you so far?"
            ids={MARKETING_CHANNELS}
            labels={MARKETING_CHANNEL_LABELS}
            value={field.value}
            onChange={field.onChange}
            error={errors.channelsWorkingBest}
          />
        )}
      />

      <Controller
        name="preferredContent"
        control={control}
        render={({ field }) => (
          <CheckboxField
            name="preferredContent"
            label="Q17: What type of content does your target audience engage with most?"
            ids={CONTENT_TYPES}
            labels={CONTENT_TYPE_LABELS}
            value={field.value}
            onChange={field.onChange}
            error={errors.preferredContent}
          />
        )}
      />
    </FieldGroup>
  );
}
