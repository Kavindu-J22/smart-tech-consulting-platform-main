import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ModuleIcon } from "@/components/shared/module-icon";
import { MODULE_STRONG_COLOURS, ProgressMark } from "@/components/shared/progress-mark";
import { MODULES } from "@/features/company/options";
import { cn } from "@/lib/utils";
import {
  DOCUMENT_MODULES,
  DOCUMENT_MODULE_LABELS,
  SOURCE_TYPES,
  SOURCE_TYPE_LABELS,
} from "@/features/knowledge/options";

// The overview's main question: which modules can the assessments draw sources from?
// The mark fills a square for every module with at least one document; the rows below say
// how many, of which kind, with one small square per document (up to MAX_SQUARES).
const MAX_SQUARES = 12;
type Props = {
  counts: { module: string; sourceType: string; _count: { _all: number } }[];
};

export function ModuleCoverage({ counts }: Props) {
  function countFor(module: string, sourceType?: string) {
    return counts
      .filter((row) => row.module === module && (!sourceType || row.sourceType === sourceType))
      .reduce((sum, row) => sum + row._count._all, 0);
  }

  const covered = MODULES.filter((module) => countFor(module) > 0);
  const missing = MODULES.filter((module) => countFor(module) === 0);

  return (
    <section aria-labelledby="coverage-heading" className="flex flex-col gap-4">
      <h2 id="coverage-heading" className="text-lg font-bold text-neutral-900">
        Sources by module
      </h2>
      <div className="overflow-clip rounded-xl border">
        <div className="flex items-center gap-5 border-b p-5 sm:gap-6 sm:p-6">
          <ProgressMark filled={covered} size="lg" />
          <div className="flex flex-col gap-1">
            <p className="text-lg font-bold text-balance text-neutral-900">
              {coverageLine(covered.length)}
            </p>
            {missing.length > 0 && (
              <p className="text-sm text-neutral-600">
                {listLabels(missing)} {missing.length === 1 ? "has" : "have"} none yet.
              </p>
            )}
          </div>
        </div>

        <ul className="divide-y">
          {DOCUMENT_MODULES.map((module) => {
            const total = countFor(module);
            const kinds = SOURCE_TYPES.filter((type) => countFor(module, type) > 0).map(
              (type) => `${countFor(module, type)} ${SOURCE_TYPE_LABELS[type].toLowerCase()}`,
            );
            return (
              <li key={module}>
                <Link
                  href={`/admin/documents?module=${module}`}
                  className="grid grid-cols-[auto_1fr_auto] items-center gap-x-4 gap-y-3 px-5 py-4 transition-colors hover:bg-neutral-50 focus-visible:bg-neutral-50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset sm:grid-cols-[auto_11rem_1fr_auto] sm:px-6"
                >
                  {module === "shared" ? (
                    <span className="flex size-11 items-center justify-center rounded-lg bg-neutral-100">
                      <ProgressMark filled={MODULES} />
                    </span>
                  ) : (
                    <ModuleIcon module={module} />
                  )}
                  <span className="flex min-w-0 flex-col">
                    <span className="font-bold text-neutral-900">
                      {module === "shared" ? "Shared" : DOCUMENT_MODULE_LABELS[module]}
                    </span>
                    <span className="text-sm text-neutral-600 sm:hidden">
                      {total === 0 ? "No sources yet" : kinds.join(" · ")}
                    </span>
                  </span>
                  <span className="hidden flex-col gap-2 sm:flex">
                    {/* Squares, not a bar: a full bar reads as a top score, and one document is not "complete" */}
                    <span aria-hidden="true" className="flex h-2.5 items-center gap-1">
                      {Array.from({ length: Math.min(total, MAX_SQUARES) }, (_, index) => (
                        <span
                          key={index}
                          className={cn(
                            "size-2.5 rounded-[3px]",
                            MODULE_STRONG_COLOURS[module] ?? "bg-neutral-550",
                          )}
                        />
                      ))}
                      {total > MAX_SQUARES && (
                        <span className="ml-1 text-xs text-neutral-600">
                          +{total - MAX_SQUARES}
                        </span>
                      )}
                      {total === 0 && (
                        <span className="size-2.5 rounded-[3px] border-[1.5px] border-neutral-300" />
                      )}
                    </span>
                    <span className="text-sm text-neutral-600">
                      {total === 0 ? "No sources yet" : kinds.join(" · ")}
                    </span>
                  </span>
                  <span className="flex items-center gap-2 text-neutral-900">
                    <span className="font-mono text-lg font-medium tabular-nums">{total}</span>
                    <span className="sr-only">{total === 1 ? "document" : "documents"}</span>
                    <ChevronRight
                      aria-hidden="true"
                      className="size-4 text-neutral-550"
                      strokeWidth={1.5}
                    />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function coverageLine(coveredCount: number) {
  if (coveredCount === 0) return "No module has sources yet";
  if (coveredCount === MODULES.length) return "All four modules have sources";
  return `${coveredCount} of 4 modules have sources`;
}

// "Marketing", "Marketing and Product", "Infrastructure, Marketing and Product"
function listLabels(modules: readonly string[]) {
  const labels = modules.map((module) => DOCUMENT_MODULE_LABELS[module]);
  if (labels.length === 1) return labels[0];
  return `${labels.slice(0, -1).join(", ")} and ${labels.at(-1)}`;
}
