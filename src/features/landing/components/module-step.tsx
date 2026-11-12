import { Badge } from "@/components/ui/badge";
import { ModuleIcon } from "@/components/shared/module-icon";
import { MODULE_STRONG_COLOURS, ProgressMark } from "@/components/shared/progress-mark";
import { MODULE_DESCRIPTIONS, MODULE_LABELS } from "@/features/company/options";
import { cn } from "@/lib/utils";

export type ExampleStep = {
  module: string;
  question: string;
  answers: string[];
  answer: string;
  score: number;
  gap: string;
  fix: string;
  source: string;
};

// One module of the example company: a question with its picked answer, then the score it
// gave. The answers are drawn like ChoiceField cards but can't be clicked; it's a picture of
// the form, not the form.
type Props = { step: ExampleStep; filled: readonly string[]; ref?: React.Ref<HTMLElement> };

export function ModuleStep({ step, filled, ref }: Props) {
  return (
    <article
      ref={ref}
      aria-labelledby={`${step.module}-heading`}
      className="flex scroll-mt-6 flex-col gap-6 py-12 lg:min-h-[80svh] lg:justify-center lg:py-20"
    >
      <div className="flex items-center gap-4">
        <ModuleIcon module={step.module} />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <h2 id={`${step.module}-heading`} className="text-lg font-bold text-neutral-900">
            {MODULE_LABELS[step.module]}
          </h2>
          <p className="text-sm text-neutral-600">{MODULE_DESCRIPTIONS[step.module]}</p>
        </div>
        {/* Phones have no big mark beside the text, so each step carries the small one */}
        <span className="lg:hidden">
          <ProgressMark filled={filled} size="lg" />
        </span>
      </div>

      <figure className="flex max-w-xl flex-col rounded-xl border bg-background">
        <div className="flex flex-col gap-3 p-5 sm:p-6">
          <p className="font-bold text-pretty text-neutral-900">{step.question}</p>
          <ul className="flex flex-col gap-3">
            {step.answers.map((answer) => {
              const isPicked = answer === step.answer;
              return (
                <li
                  key={answer}
                  className={cn(
                    "flex min-h-14 items-center gap-3 rounded-lg border px-4 py-3 text-base font-medium",
                    isPicked
                      ? "border-neutral-900 text-neutral-900 ring-1 ring-neutral-900"
                      : "border-input text-neutral-700",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "flex size-5 shrink-0 items-center justify-center rounded-full border",
                      isPicked ? "border-neutral-900" : "border-input",
                    )}
                  >
                    {isPicked && <span className="size-2.5 rounded-full bg-neutral-900" />}
                  </span>
                  {answer}
                  {isPicked && <span className="sr-only">(picked)</span>}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex flex-col gap-2 border-t p-5 sm:p-6">
          <div className="flex items-baseline justify-between gap-4">
            <span className="flex items-center gap-2">
              <span className="font-bold text-neutral-900">Score</span>
              {/* Sample data is labelled wherever it shows, since a phone may not show the big mark */}
              <Badge variant="secondary">Example</Badge>
            </span>
            <span className="text-sm text-neutral-600">
              <span className="font-mono text-lg font-medium text-neutral-900 tabular-nums">
                {step.score}
              </span>{" "}
              of 100
            </span>
          </div>
          <span className="h-2 overflow-hidden rounded-full bg-neutral-100">
            <span
              className={cn("block h-full rounded-full", MODULE_STRONG_COLOURS[step.module])}
              style={{ width: `${step.score}%` }}
            />
          </span>
          <p className="mt-1 text-sm text-neutral-600">
            {step.gap}
            <sup className="ml-0.5 font-bold text-lilac-400">1</sup>
          </p>
          <p className="text-sm text-neutral-700">
            <span className="font-semibold text-neutral-900">Fix first:</span> {step.fix}
          </p>
        </div>

        <figcaption className="border-t px-5 py-3 text-xs text-neutral-600 sm:px-6">
          <sup className="mr-1 font-bold text-lilac-400">1</sup>
          {step.source}
        </figcaption>
      </figure>
    </article>
  );
}
