"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { FieldError, FieldLegend, FieldSet } from "@/components/ui/field";

// ChoiceField's look for "pick any that apply": a labelled set of 56px cards from an
// options.ts list, each with a real checkbox so keyboards and screen readers work.
type Props = {
  name: string;
  label: string;
  ids: readonly string[];
  labels: Record<string, string>;
  value: string[] | null | undefined;
  onChange: (value: string[]) => void;
  error?: { message?: string };
};

export function CheckboxField({ name, label, ids, labels, value, onChange, error }: Props) {
  const selected = value ?? [];

  function toggle(id: string, isChecked: boolean) {
    // Keep the list's order, so stored answers don't depend on the order of clicks.
    onChange(ids.filter((other) => (other === id ? isChecked : selected.includes(other))));
  }

  return (
    <FieldSet data-invalid={!!error}>
      <FieldLegend variant="label">{label}</FieldLegend>
      {/* @container so the columns follow the form's width, not the window's */}
      <div className="@container">
        <div className="grid grid-cols-1 gap-3 @sm:grid-cols-2">
          {ids.map((id) => (
            <label
              key={id}
              htmlFor={`${name}-${id}`}
              className="flex min-h-14 cursor-pointer items-center gap-3 rounded-lg border border-input bg-background px-4 py-3 text-base font-medium text-neutral-700 transition-colors hover:border-neutral-600 has-focus-visible:border-ring has-aria-invalid:border-destructive has-data-checked:border-neutral-900 has-data-checked:text-neutral-900 has-data-checked:ring-1 has-data-checked:ring-neutral-900"
            >
              <Checkbox
                id={`${name}-${id}`}
                checked={selected.includes(id)}
                onCheckedChange={(checked) => toggle(id, checked === true)}
                aria-invalid={!!error}
                className="size-5"
              />
              {labels[id]}
            </label>
          ))}
        </div>
      </div>
      <FieldError errors={[error]} />
    </FieldSet>
  );
}
