"use client";

import { Controller, type Control, type FieldErrors } from "react-hook-form";
import { FieldGroup } from "@/components/ui/field";
import { ChoiceField } from "@/components/shared/choice-field";
import {
  LITERACY_TIERS,
  LITERACY_TIER_LABELS,
  MESSAGE_DETAIL_LABELS,
  MESSAGE_DETAIL_PREFERENCES,
  TECH_COMFORT_LABELS,
  TECH_COMFORT_LEVELS,
  TECH_TERMS_FAMILIARITY,
  TECH_TERMS_LABELS,
} from "@/features/marketing/options";
import type { MarketingAnswers } from "@/features/marketing/schema";

type Props = {
  control: Control<MarketingAnswers>;
  errors: FieldErrors<MarketingAnswers>;
};

export function StepLiteracy({ control, errors }: Props) {
  return (
    <FieldGroup>
      <div className="border-neutral-150 mb-2 rounded-lg border bg-neutral-50/50 p-4">
        <h3 className="text-sm font-semibold text-neutral-900">
          Section C: Audience Technical Literacy & Communication (Q10–Q12)
        </h3>
        <p className="mt-0.5 text-xs text-neutral-500">
          Evaluate customer comfort with technical concepts. Q10 and Q11 drive the algorithmic
          heuristic signal; Q12 governs preferred communication detail.
        </p>
      </div>

      <Controller
        name="techComfort"
        control={control}
        render={({ field }) => (
          <ChoiceField
            name="techComfort"
            label="Q10: How would you describe your target customer's comfort with technology?"
            ids={TECH_COMFORT_LEVELS}
            labels={TECH_COMFORT_LABELS}
            value={field.value}
            onChange={field.onChange}
            error={errors.techComfort}
          />
        )}
      />

      <Controller
        name="techTermsFamiliarity"
        control={control}
        render={({ field }) => (
          <ChoiceField
            name="techTermsFamiliarity"
            label="Q11: How familiar is your target customer with technical terms related to your product?"
            ids={TECH_TERMS_FAMILIARITY}
            labels={TECH_TERMS_LABELS}
            value={field.value}
            onChange={field.onChange}
            error={errors.techTermsFamiliarity}
          />
        )}
      />

      <Controller
        name="messageDetailPreference"
        control={control}
        render={({ field }) => (
          <ChoiceField
            name="messageDetailPreference"
            label="Q12: How detailed should your marketing communication be for this audience?"
            ids={MESSAGE_DETAIL_PREFERENCES}
            labels={MESSAGE_DETAIL_LABELS}
            value={field.value}
            onChange={field.onChange}
            error={errors.messageDetailPreference}
          />
        )}
      />

      {/* Target Audience Literacy Override (Optional) */}
      <div className="mt-2 rounded-lg border border-neutral-200 bg-neutral-50/40 p-4">
        <div className="mb-3">
          <p className="text-sm font-semibold text-neutral-900">
            Target Audience Literacy for Recommended Message (Optional Override)
          </p>
          <p className="mt-0.5 text-xs text-neutral-500">
            By default, the AI classifier automatically selects the best matching message tier based
            on your Q10+Q11 answers and persona description. You can optionally force the recommended
            copy to match an explicit tier below.
          </p>
        </div>

        <Controller
          name="targetAudienceLiteracyOverride"
          control={control}
          render={({ field }) => (
            <ChoiceField
              name="targetAudienceLiteracyOverride"
              label="Select preferred messaging tier (or leave default for automatic heuristic selection):"
              ids={LITERACY_TIERS}
              labels={LITERACY_TIER_LABELS}
              value={field.value ?? ""}
              onChange={field.onChange}
              error={errors.targetAudienceLiteracyOverride}
            />
          )}
        />
      </div>
    </FieldGroup>
  );
}
