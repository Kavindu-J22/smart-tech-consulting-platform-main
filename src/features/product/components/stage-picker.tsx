"use client";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChartColumn, Lightbulb, Wrench } from "lucide-react";
import { FieldGroup } from "@/components/ui/field";
import { AppButton } from "@/components/shared/app-button";
import { ChoiceCardField } from "@/components/shared/choice-card-field";
import {
  PRODUCT_STAGES,
  PRODUCT_STAGE_DESCRIPTIONS,
  PRODUCT_STAGE_LABELS,
  PRODUCT_STAGE_TAGS,
} from "@/features/product/options";
import { StageSchema, type StageInput } from "@/features/product/schema";
import { createProductAssessmentAction } from "@/features/product/actions";

const STAGE_ICONS = { proposed: Lightbulb, development: Wrench, failed: ChartColumn };

// What the founder gets, shown under the button as in the prototype.
const WHAT_YOU_GET = [
  { title: "Stage-specific questions", text: "Tailored to your exact product stage" },
  { title: "AI-powered analysis", text: "Insights from your answers and similar products" },
  { title: "Actionable report", text: "Prioritised recommendations and a SWOT analysis" },
];

type Props = { companyId: string };

export function StagePicker({ companyId }: Props) {
  const form = useForm<StageInput>({ resolver: zodResolver(StageSchema) });
  const [pending, startTransition] = useTransition();

  const onSubmit = form.handleSubmit((values) =>
    // Nothing a founder can get wrong here, so there's no error message: it saves and moves on.
    startTransition(() => createProductAssessmentAction(companyId, values)),
  );

  return (
    <div className="flex flex-col gap-10">
      <form onSubmit={onSubmit} noValidate>
        <FieldGroup>
          <Controller
            control={form.control}
            name="stage"
            render={({ field }) => (
              <ChoiceCardField
                name={field.name}
                label="What stage is your product or service currently in?"
                ids={PRODUCT_STAGES}
                labels={PRODUCT_STAGE_LABELS}
                descriptions={PRODUCT_STAGE_DESCRIPTIONS}
                tags={PRODUCT_STAGE_TAGS}
                icons={STAGE_ICONS}
                value={field.value}
                onChange={field.onChange}
                error={form.formState.errors.stage}
              />
            )}
          />
          <AppButton type="submit" size="lg" disabled={pending} className="self-start">
            {pending ? "Starting…" : "Start assessment"}
          </AppButton>
        </FieldGroup>
      </form>

      <dl className="grid gap-6 border-t pt-8 sm:grid-cols-3">
        {WHAT_YOU_GET.map((item) => (
          <div key={item.title} className="flex flex-col gap-1">
            <dt className="text-sm font-bold text-neutral-900">{item.title}</dt>
            <dd className="text-sm text-neutral-600">{item.text}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
