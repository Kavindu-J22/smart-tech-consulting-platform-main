import { MODULES, MODULE_LABELS } from "@/features/company/options";
import { MODULE_STRONG_COLOURS } from "@/components/shared/progress-mark";
import { cn } from "@/lib/utils";

// The logo's 2x2 grid at page size. A square fills with its module colour and the example
// score once that module has been shown. Module names sit outside the squares, because 14px
// charcoal on the lilac square is below 4.5:1; the large score inside passes as large text.
// Decorative: the caption and the steps say the same thing in words.
const SIZES = {
  md: { grid: "gap-x-5 gap-y-5", square: "size-24", score: "text-2xl" },
  lg: { grid: "gap-x-8 gap-y-8", square: "size-36 xl:size-40", score: "text-4xl" },
};

type Props = { scores: Record<string, number>; filled: readonly string[]; size?: "md" | "lg" };

export function StoryMark({ scores, filled, size = "lg" }: Props) {
  return (
    <div aria-hidden="true" className={cn("grid w-fit grid-cols-2", SIZES[size].grid)}>
      {MODULES.map((module, index) => {
        const isFilled = filled.includes(module);
        // Names go above the top row and below the bottom row, so the squares keep the logo's gaps
        const isTopRow = index < 2;

        return (
          <div
            key={module}
            className={cn("flex gap-2", isTopRow ? "flex-col" : "flex-col-reverse")}
          >
            <span
              className={cn(
                "text-sm font-medium transition-colors",
                isFilled ? "text-neutral-900" : "text-neutral-600",
              )}
            >
              {MODULE_LABELS[module]}
            </span>
            <span
              className={cn(
                "relative flex items-center justify-center overflow-hidden rounded-[25%] border-[1.5px] bg-background transition-colors duration-500 motion-reduce:transition-none",
                SIZES[size].square,
                isFilled ? "border-transparent" : "border-neutral-300",
              )}
            >
              <span
                className={cn(
                  "absolute inset-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
                  MODULE_STRONG_COLOURS[module],
                  isFilled ? "scale-100" : "scale-0",
                )}
              />
              <span
                className={cn(
                  "relative font-mono font-medium text-neutral-900 tabular-nums transition-opacity delay-150 duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
                  SIZES[size].score,
                  isFilled ? "opacity-100" : "opacity-0",
                )}
              >
                {scores[module]}
              </span>
            </span>
          </div>
        );
      })}
    </div>
  );
}
