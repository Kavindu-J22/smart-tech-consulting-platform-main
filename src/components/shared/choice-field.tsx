"use client";
import { FieldError, FieldLegend, FieldSet } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

// A labelled set of choice cards for a list from an options.ts file. Each option is a 56px
// card you can click anywhere on. Still a real radio group underneath, so arrow keys and
// screen readers work.
type Props = {
  name: string;
  label: string;
  ids: readonly string[];
  labels: Record<string, string>;
  value: string | null | undefined;
  onChange: (value: string) => void;
  error?: { message?: string };
};

export function ChoiceField({ name, label, ids, labels, value, onChange, error }: Props) {
  // Three options sit on one row when there's room. Other counts use two columns.
  const hasThree = ids.length === 3;

  return (
    <FieldSet data-invalid={!!error}>
      <FieldLegend variant="label">{label}</FieldLegend>
      {/* @container so the columns follow the form's width, not the window's */}
      <div className="@container">
        <RadioGroup
          value={value ?? ""}
          // form.reset() also resets the <form>, and Radix reports that as "". Passing it on
          // would mark the field invalid straight after a successful submit.
          onValueChange={(next) => next && onChange(next)}
          className={cn("grid-cols-1 gap-3 @sm:grid-cols-2", hasThree && "@md:grid-cols-3")}
        >
          {ids.map((id) => (
            <label
              key={id}
              htmlFor={`${name}-${id}`}
              className="flex min-h-14 cursor-pointer items-center gap-3 rounded-lg border border-input bg-background px-4 py-3 text-base font-medium text-neutral-700 transition-colors hover:border-neutral-600 has-focus-visible:border-ring has-aria-invalid:border-destructive has-data-checked:border-neutral-900 has-data-checked:text-neutral-900 has-data-checked:ring-1 has-data-checked:ring-neutral-900"
            >
              <RadioGroupItem
                id={`${name}-${id}`}
                value={id}
                aria-invalid={!!error}
                className="size-5"
              />
              {labels[id]}
            </label>
          ))}
        </RadioGroup>
      </div>
      <FieldError errors={[error]} />
    </FieldSet>
  );
}
