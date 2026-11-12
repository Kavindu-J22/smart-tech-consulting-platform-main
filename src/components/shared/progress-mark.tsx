import { MODULES } from "@/features/company/options";
import { cn } from "@/lib/utils";

// The logo's 2x2 grid, used to show which modules are done (or, for an admin, which modules
// have sources). A filled square is the module's strong colour; an empty one is an outline.
// Decorative: the text next to it always says the same thing in words.
export const MODULE_STRONG_COLOURS: Record<string, string> = {
  infrastructure: "bg-blue-300",
  marketing: "bg-yellow-300",
  compliance: "bg-lilac-300",
  product: "bg-lime-300",
};

const SIZES = {
  sm: { grid: "gap-0.5", square: "size-2.5 rounded-[3px]" },
  lg: { grid: "gap-1.5", square: "size-7 rounded-[7px]" },
};

type Props = { filled: readonly string[]; size?: "sm" | "lg" };

export function ProgressMark({ filled, size = "sm" }: Props) {
  return (
    <span aria-hidden="true" className={cn("grid w-fit shrink-0 grid-cols-2", SIZES[size].grid)}>
      {MODULES.map((module) => (
        <span
          key={module}
          className={cn(
            SIZES[size].square,
            filled.includes(module)
              ? MODULE_STRONG_COLOURS[module]
              : "border-[1.5px] border-neutral-300 bg-background",
          )}
        />
      ))}
    </span>
  );
}
