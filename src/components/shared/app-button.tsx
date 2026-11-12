import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// The one button the app uses, so every page has the same sizes and styles.
// md is 44px (a full tap target on phones). lg is 56px, for a submit button under 56px fields.
type Props = Omit<React.ComponentProps<typeof Button>, "variant" | "size"> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "md" | "lg";
};

const VARIANTS = {
  primary: "default",
  secondary: "outline",
  danger: "default",
  ghost: "ghost",
} as const;

export function AppButton({ variant = "primary", size = "md", className, ...props }: Props) {
  return (
    <Button
      variant={VARIANTS[variant]}
      className={cn(
        "rounded-lg text-base",
        size === "md" ? "h-11 px-5" : "h-14 px-6",
        variant === "secondary" && "border-neutral-550 text-neutral-900",
        // ui's destructive style is a pale pink tint; a delete confirm needs a solid button
        variant === "danger" && "bg-destructive text-neutral-0 hover:bg-destructive/90",
        className,
      )}
      {...props}
    />
  );
}
