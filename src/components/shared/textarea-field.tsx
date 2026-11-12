import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

// A labelled box for a longer written answer, with its error underneath. Looks like TextField
// but grows with its text. 16px text stops iOS zooming in on focus.
type Props = React.ComponentProps<typeof Textarea> & {
  id: string;
  label: string;
  error?: { message?: string };
};

export function TextareaField({ id, label, error, ...props }: Props) {
  return (
    <Field data-invalid={!!error}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Textarea
        id={id}
        aria-invalid={!!error}
        className="min-h-28 rounded-lg bg-background px-4 py-3 text-base md:text-base"
        {...props}
      />
      <FieldError errors={[error]} />
    </Field>
  );
}
