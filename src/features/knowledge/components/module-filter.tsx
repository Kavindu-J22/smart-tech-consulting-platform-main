import Link from "next/link";
import { MODULE_STRONG_COLOURS } from "@/components/shared/progress-mark";
import { DOCUMENT_MODULES, DOCUMENT_MODULE_LABELS } from "@/features/knowledge/options";
import { cn } from "@/lib/utils";

// Plain links with ?module=, so a filtered list has its own URL and works without JavaScript.
type Props = {
  current: string | undefined;
  counts: { module: string; _count: { _all: number } }[];
};

export function ModuleFilter({ current, counts }: Props) {
  function countFor(module?: string) {
    return counts
      .filter((row) => !module || row.module === module)
      .reduce((sum, row) => sum + row._count._all, 0);
  }

  const options = [undefined, ...DOCUMENT_MODULES];

  return (
    <nav aria-label="Filter by module" className="flex flex-wrap gap-2">
      {options.map((module) => {
        const isActive = current === module;
        return (
          <Link
            key={module ?? "all"}
            href={module ? `/admin/documents?module=${module}` : "/admin/documents"}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex h-11 items-center gap-2 rounded-xl border px-4 text-sm font-medium transition-colors",
              isActive
                ? "border-neutral-900 bg-neutral-900 text-neutral-0"
                : "border-neutral-300 text-neutral-700 hover:border-neutral-550 hover:text-neutral-900",
            )}
          >
            {module && module !== "shared" && (
              <span
                aria-hidden="true"
                className={cn("size-2.5 rounded-[3px]", MODULE_STRONG_COLOURS[module])}
              />
            )}
            {module ? (module === "shared" ? "Shared" : DOCUMENT_MODULE_LABELS[module]) : "All"}
            <span
              className={cn(
                "font-mono tabular-nums",
                isActive ? "text-neutral-300" : "text-neutral-600",
              )}
            >
              {countFor(module)}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
