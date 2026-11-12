"use client";
import type { LucideIcon } from "lucide-react";
import { FieldError, FieldLegend, FieldSet } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// ChoiceField for a few big choices that each need explaining: every option is a card with an
// icon, a small tag, its label and a description. Still a real radio group underneath, so
// arrow keys and screen readers work.
type Props = {
  name: string;
  label: string;
  ids: readonly string[];
  labels: Record<string, string>;
  descriptions: Record<string, string>;
  tags: Record<string, string>;
  icons: Record<string, LucideIcon>;
  value: string | null | undefined;
  onChange: (value: string) => void;
  error?: { message?: string };
};

export function ChoiceCardField({
  name,
  label,
  ids,
  labels,
  descriptions,
  tags,
  icons,
  value,
  onChange,
  error,
}: Props) {
  return (
    <FieldSet data-invalid={!!error}>
      <FieldLegend variant="label">{label}</FieldLegend>
      {/* @container so the columns follow the form's width, not the window's */}
      <div className="@container">
        <RadioGroup
          value={value ?? ""}
          // form.reset() reports "" (see ChoiceField); passing it on would mark the field invalid
          onValueChange={(next) => next && onChange(next)}
          className="grid-cols-1 gap-4 @2xl:grid-cols-3"
        >
          {ids.map((id) => {
            const Icon = icons[id];
            return (
              <label
                key={id}
                htmlFor={`${name}-${id}`}
                className="group relative flex cursor-pointer flex-col gap-3 rounded-xl border border-input bg-background p-5 transition-colors hover:border-neutral-600 has-focus-visible:border-ring has-aria-invalid:border-destructive has-data-checked:border-neutral-900 has-data-checked:ring-1 has-data-checked:ring-neutral-900"
              >
                <RadioGroupItem
                  id={`${name}-${id}`}
                  value={id}
                  aria-invalid={!!error}
                  className="absolute top-5 right-5 size-5"
                />
                <span
                  aria-hidden="true"
                  className="flex size-11 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700 transition-colors group-has-data-checked:bg-neutral-900 group-has-data-checked:text-neutral-0"
                >
                  <Icon className="size-5" strokeWidth={1.5} />
                </span>
                <span className="self-start rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-700">
                  {tags[id]}
                </span>
                <span className="font-bold text-neutral-900">{labels[id]}</span>
                <span className="text-sm text-neutral-600">{descriptions[id]}</span>
              </label>
            );
          })}
        </RadioGroup>
      </div>
      <FieldError errors={[error]} />
    </FieldSet>
  );
}
