"use client";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { FieldGroup } from "@/components/ui/field";
import { AppButton } from "@/components/shared/app-button";
import { ChoiceField } from "@/components/shared/choice-field";
import { FormPanel } from "@/components/shared/form-panel";
import { TextField } from "@/components/shared/text-field";
import { CompanyIllustration } from "@/features/company/components/company-illustration";
import {
  GEOGRAPHIC_FOCUSES,
  GEOGRAPHIC_FOCUS_LABELS,
  OPERATING_MODES,
  OPERATING_MODE_LABELS,
  PRODUCT_TYPES,
  PRODUCT_TYPE_LABELS,
  STAGES,
  STAGE_LABELS,
} from "@/features/company/options";
import { CompanySchema, type CompanyInput } from "@/features/company/schema";
import { createCompanyAction, updateCompanyAction } from "@/features/company/actions";

type Props = { companyId?: string; defaultValues?: CompanyInput };

export function CompanyForm({ companyId, defaultValues }: Props) {
  const form = useForm<CompanyInput>({
    resolver: zodResolver(CompanySchema),
    defaultValues: defaultValues ?? {
      name: "",
      industry: null,
      geographicFocus: null,
      budgetLkr: null,
    },
  });
  const [pending, startTransition] = useTransition();
  const { errors } = form.formState;
  let submitLabel = companyId ? "Save changes" : "Create company";
  if (pending) submitLabel = companyId ? "Saving…" : "Creating…";

  const onSubmit = form.handleSubmit((values) =>
    startTransition(async () => {
      const result = companyId
        ? await updateCompanyAction(companyId, values)
        : await createCompanyAction(values);
      if (result?.error) toast.error(result.error);
    }),
  );

  return (
    <FormPanel
      title="Company context"
      description="Tell us about your business to customize your marketing, compliance, product, and infrastructure assessments."
      illustration={<CompanyIllustration />}
    >
      <form onSubmit={onSubmit} noValidate className="max-w-xl">
        <FieldGroup>
          <TextField
            id="name"
            label="Company name"
            error={errors.name}
            {...form.register("name")}
          />

          <Controller
            control={form.control}
            name="stage"
            render={({ field }) => (
              <ChoiceField
                name={field.name}
                label="Stage"
                ids={STAGES}
                labels={STAGE_LABELS}
                value={field.value}
                onChange={field.onChange}
                error={errors.stage}
              />
            )}
          />

          <Controller
            control={form.control}
            name="productType"
            render={({ field }) => (
              <ChoiceField
                name={field.name}
                label="Product type"
                ids={PRODUCT_TYPES}
                labels={PRODUCT_TYPE_LABELS}
                value={field.value}
                onChange={field.onChange}
                error={errors.productType}
              />
            )}
          />

          <Controller
            control={form.control}
            name="operatingMode"
            render={({ field }) => (
              <ChoiceField
                name={field.name}
                label="How the team works"
                ids={OPERATING_MODES}
                labels={OPERATING_MODE_LABELS}
                value={field.value}
                onChange={field.onChange}
                error={errors.operatingMode}
              />
            )}
          />

          <TextField
            id="industry"
            label="Industry (optional)"
            error={errors.industry}
            placeholder="e.g. FinTech"
            {...form.register("industry", { setValueAs: (value) => value?.trim() || null })}
          />

          <Controller
            control={form.control}
            name="geographicFocus"
            render={({ field }) => (
              <ChoiceField
                name={field.name}
                label="Geographic focus (optional)"
                ids={GEOGRAPHIC_FOCUSES}
                labels={GEOGRAPHIC_FOCUS_LABELS}
                value={field.value}
                onChange={field.onChange}
                error={errors.geographicFocus}
              />
            )}
          />

          <TextField
            id="budgetLkr"
            label="Budget in LKR (optional)"
            error={errors.budgetLkr}
            type="number"
            min={0}
            step={1}
            placeholder="5000000"
            {...form.register("budgetLkr", {
              setValueAs: (value) => (value === "" || value === null ? null : Number(value)),
            })}
          />

          {/* lg: the same height as the fields above it */}
          <AppButton type="submit" size="lg" disabled={pending} className="self-start">
            {submitLabel}
          </AppButton>
        </FieldGroup>
      </form>
    </FormPanel>
  );
}
