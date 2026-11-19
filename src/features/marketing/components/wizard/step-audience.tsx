"use client";

import { useEffect } from "react";
import {
  Controller,
  useWatch,
  type Control,
  type FieldErrors,
  type UseFormRegister,
  type UseFormSetValue,
} from "react-hook-form";
import { FieldGroup } from "@/components/ui/field";
import { TextareaField } from "@/components/shared/textarea-field";
import { ChoiceField } from "@/components/shared/choice-field";
import {
  AGE_GROUPS,
  AGE_GROUP_LABELS,
  AUDIENCE_LOCATIONS,
  AUDIENCE_LOCATION_LABELS,
  CUSTOMER_ROLES,
  CUSTOMER_ROLE_LABELS,
  MARKET_TYPES,
  MARKET_TYPE_LABELS,
} from "@/features/marketing/options";
import type { MarketingAnswers } from "@/features/marketing/schema";

type Props = {
  register: UseFormRegister<MarketingAnswers>;
  control: Control<MarketingAnswers>;
  setValue: UseFormSetValue<MarketingAnswers>;
  errors: FieldErrors<MarketingAnswers>;
};

export function StepAudience({ register, control, setValue, errors }: Props) {
  const marketType = useWatch({ control, name: "marketType" });
  const isAgeDisabled = marketType === "b2b" || marketType === "both";

  // Automatically clear stale age group selections when switching to B2B or Both
  useEffect(() => {
    if (isAgeDisabled) {
      setValue("ageGroup", null, { shouldValidate: false });
    }
  }, [isAgeDisabled, setValue]);

  return (
    <FieldGroup>
      <div className="border-neutral-150 mb-2 rounded-lg border bg-neutral-50/50 p-4">
        <h3 className="text-sm font-semibold text-neutral-900">
          Section B: Target Customer Persona & Geography (Q5–Q9)
        </h3>
        <p className="mt-0.5 text-xs text-neutral-500">
          Define your target market profile. The NLP classifier uses this persona description and
          role context to determine technical literacy levels.
        </p>
      </div>

      <TextareaField
        id="primaryTargetCustomer"
        label="Q5: Who is your primary target customer? Describe their background"
        placeholder="Describe your ideal user (e.g. Small retail shop owners in Kandy who manage physical stock with paper ledgers, or Colombo IT project leads)..."
        error={errors.primaryTargetCustomer}
        {...register("primaryTargetCustomer")}
      />

      <Controller
        name="marketType"
        control={control}
        render={({ field }) => (
          <ChoiceField
            name="marketType"
            label="Q6: Is your target market B2B, B2C, or both?"
            ids={MARKET_TYPES}
            labels={MARKET_TYPE_LABELS}
            value={field.value}
            onChange={(val) => {
              field.onChange(val);
              if (val === "b2b" || val === "both") {
                setValue("ageGroup", null, { shouldValidate: false });
              }
            }}
            error={errors.marketType}
          />
        )}
      />

      {isAgeDisabled ? (
        <div className="rounded-lg border border-dashed border-neutral-300 bg-neutral-50/80 p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-neutral-800">
                Q7: What age group best represents your target customer?
              </p>
              <p className="mt-1 text-xs text-neutral-500">
                Age targeting not required for B2B or mixed B2B/B2C assessment. Target audience is
                characterized by professional role (Q8) and industry rather than consumer age bracket.
              </p>
            </div>
            <span className="shrink-0 rounded bg-neutral-200 px-2.5 py-1 text-xs font-semibold text-neutral-600">
              Not Required for {marketType === "b2b" ? "B2B" : "Mixed B2B/B2C"}
            </span>
          </div>
        </div>
      ) : (
        <Controller
          name="ageGroup"
          control={control}
          render={({ field }) => (
            <ChoiceField
              name="ageGroup"
              label="Q7: What age group best represents your target customer? (Required for B2C)"
              ids={AGE_GROUPS}
              labels={AGE_GROUP_LABELS}
              value={field.value}
              onChange={field.onChange}
              error={errors.ageGroup}
            />
          )}
        />
      )}

      <Controller
        name="customerRole"
        control={control}
        render={({ field }) => (
          <ChoiceField
            name="customerRole"
            label="Q8: What is the typical occupation or role of your target customer?"
            ids={CUSTOMER_ROLES}
            labels={CUSTOMER_ROLE_LABELS}
            value={field.value}
            onChange={field.onChange}
            error={errors.customerRole}
          />
        )}
      />

      <Controller
        name="audienceLocation"
        control={control}
        render={({ field }) => (
          <ChoiceField
            name="audienceLocation"
            label="Q9: Where is your target audience primarily located in Sri Lanka?"
            ids={AUDIENCE_LOCATIONS}
            labels={AUDIENCE_LOCATION_LABELS}
            value={field.value}
            onChange={field.onChange}
            error={errors.audienceLocation}
          />
        )}
      />
    </FieldGroup>
  );
}
