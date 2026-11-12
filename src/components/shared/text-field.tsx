import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

// A labelled 56px text field with its error underneath. Every form uses this instead of
// putting Field, Label and Input together by hand. 16px text stops iOS zooming in on focus.
type Props = React.ComponentProps<typeof Input> & {
  id: string;
  label: string;
  error?: { message?: string };
};

export function TextField({ id, label, error, ...props }: Props) {
  return (
    <Field data-invalid={!!error}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input
        id={id}
        aria-invalid={!!error}
        className="h-14 rounded-lg bg-background px-4 text-base md:text-base"
        {...props}
      />
      <FieldError errors={[error]} />
    </Field>
  );
}
