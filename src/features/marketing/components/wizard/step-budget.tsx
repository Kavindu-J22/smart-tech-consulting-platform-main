"use client";

import { Controller, type Control, type FieldErrors, type UseFormRegister } from "react-hook-form";
import { FieldGroup } from "@/components/ui/field";
import { TextField } from "@/components/shared/text-field";
import { ChoiceField } from "@/components/shared/choice-field";
import { CheckboxField } from "@/components/shared/checkbox-field";
import {
  BUDGET_FLEXIBILITIES,
  BUDGET_FLEXIBILITY_LABELS,
  CAMPAIGN_DURATIONS,
  CAMPAIGN_DURATION_LABELS,
  CAMPAIGN_GOALS,
  CAMPAIGN_GOAL_LABELS,
} from "@/features/marketing/options";
import type { MarketingAnswers } from "@/features/marketing/schema";

type Props = {
  register: UseFormRegister<MarketingAnswers>;
  control: Control<MarketingAnswers>;
  errors: FieldErrors<MarketingAnswers>;
};

export function StepBudget({ register, control, errors }: Props) {
  return (
    <FieldGroup>
      <div className="border-neutral-150 mb-2 rounded-lg border bg-neutral-50/50 p-4">
        <h3 className="text-sm font-semibold text-neutral-900">
          Section E: Campaign Budget & Strategic Goals (Q18–Q21)
        </h3>
        <p className="mt-0.5 text-xs text-neutral-500">
          Specify your campaign budget in Sri Lankan Rupees (LKR). The optimizer uses integer
          arithmetic and largest-remainder rounding to guarantee an exact-sum allocation.
        </p>
      </div>

      <TextField
        id="monthlyBudgetLkr"
        type="number"
        min={0}
        step={1000}
        label="Q18: What is your monthly marketing budget? (in LKR)"
        placeholder="e.g. 50000 (Enter 0 for organic/zero-budget plan)"
        error={errors.monthlyBudgetLkr}
        {...register("monthlyBudgetLkr", { valueAsNumber: true })}
      />

      <Controller
        name="budgetFlexibility"
        control={control}
        render={({ field }) => (
          <ChoiceField
            name="budgetFlexibility"
            label="Q19: How flexible is your marketing budget across channels?"
            ids={BUDGET_FLEXIBILITIES}
            labels={BUDGET_FLEXIBILITY_LABELS}
            value={field.value}
            onChange={field.onChange}
            error={errors.budgetFlexibility}
          />
        )}
      />

      <Controller
        name="campaignDuration"
        control={control}
        render={({ field }) => (
          <ChoiceField
            name="campaignDuration"
            label="Q20: What is your expected campaign duration?"
            ids={CAMPAIGN_DURATIONS}
            labels={CAMPAIGN_DURATION_LABELS}
            value={field.value}
            onChange={field.onChange}
            error={errors.campaignDuration}
          />
        )}
      />

      <Controller
        name="campaignGoals"
        control={control}
        render={({ field }) => (
          <CheckboxField
            name="campaignGoals"
            label="Q21: What would define a successful campaign for your business? (Select all that apply)"
            ids={CAMPAIGN_GOALS}
            labels={CAMPAIGN_GOAL_LABELS}
            value={field.value}
            onChange={field.onChange}
            error={errors.campaignGoals}
          />
        )}
      />

      <TextField
        id="reservePercentage"
        type="number"
        min={0}
        max={50}
        step={5}
        label="Optional: Strategic Unallocated Contingency Reserve (% of budget)"
        placeholder="0 (e.g. enter 10 to keep 10% in cash reserve for agile testing)"
        error={errors.reservePercentage}
        {...register("reservePercentage", { valueAsNumber: true })}
      />
    </FieldGroup>
  );
}
