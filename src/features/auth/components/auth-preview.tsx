import { Badge } from "@/components/ui/badge";
import { ModuleIcon } from "@/components/shared/module-icon";
import { ProgressMark } from "@/components/shared/progress-mark";
import { MODULE_LABELS } from "@/features/company/options";
import { cn } from "@/lib/utils";

// The login and signup pages' right half: what a company page looks like after one assessment,
// so a new founder sees the result before the form asks for anything. Everything in it is a
// made-up example and is labelled that way; the 62 and the gap are DESIGN.md's sample copy.
const ROWS = [
  { module: "infrastructure", status: "Completed" },
  { module: "marketing", status: "Draft" },
  { module: "compliance", status: "Not started" },
  { module: "product", status: "Not started" },
];

export function AuthPreview() {
  return (
    <aside aria-labelledby="preview-heading" className="hidden w-[46%] max-w-3xl p-3 lg:flex">
      <div className="flex flex-1 flex-col justify-center gap-10 rounded-2xl border border-neutral-200 bg-neutral-50 px-10 py-12 xl:px-16">
        <div className="flex max-w-md flex-col gap-3">
          <h2
            id="preview-heading"
            className="text-2xl font-bold tracking-tight text-balance text-neutral-900"
          >
            Know what to fix before you launch
          </h2>
          <p className="text-base text-neutral-600">
            Describe your company once. Four assessments score how ready it is, and every score
            shows the rule behind it.
          </p>
        </div>

        <figure className="flex max-w-lg flex-col rounded-xl border bg-background">
          <div className="flex items-center justify-between gap-4 border-b px-6 py-4">
            <span className="flex items-center gap-3 font-bold text-neutral-900">
              <ProgressMark filled={["infrastructure"]} />
              Your company
            </span>
            <Badge variant="secondary">Example</Badge>
          </div>

          <ul className="divide-y">
            {ROWS.map((row) => (
              <li key={row.module} className="flex items-start gap-4 px-6 py-4">
                <ModuleIcon module={row.module} />
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="font-bold text-neutral-900">{MODULE_LABELS[row.module]}</span>
                    {row.module === "infrastructure" ? (
                      <span className="text-sm text-neutral-600">
                        <span className="font-mono text-lg font-medium text-neutral-900 tabular-nums">
                          62
                        </span>{" "}
                        of 100
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 text-sm text-neutral-600">
                        <span
                          aria-hidden="true"
                          className={cn(
                            "size-2 rounded-full",
                            row.status === "Draft"
                              ? "border-[1.5px] border-neutral-900"
                              : "bg-neutral-550",
                          )}
                        />
                        {row.status}
                      </span>
                    )}
                  </div>
                  {row.module === "infrastructure" && (
                    <>
                      <span className="mt-1 h-2 overflow-hidden rounded-full bg-neutral-100">
                        {/* The one moving thing on the page: the score fills in once */}
                        <span className="block h-full w-[62%] rounded-full bg-blue-300 duration-1000 motion-safe:animate-in motion-safe:slide-in-from-left-full" />
                      </span>
                      <span className="mt-1 text-sm text-neutral-600">
                        Power backup is the biggest gap.
                        <sup className="ml-0.5 font-bold text-lilac-400">1</sup>
                      </span>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>

          <figcaption className="border-t px-6 py-3 text-xs text-neutral-600">
            <sup className="mr-1 font-bold text-lilac-400">1</sup>
            Weights: AHP, expert panel
          </figcaption>
        </figure>
      </div>
    </aside>
  );
}
