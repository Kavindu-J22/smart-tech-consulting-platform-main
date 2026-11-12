import Link from "next/link";
import { ModuleIcon } from "@/components/shared/module-icon";
import { MODULE_DESCRIPTIONS, MODULE_LABELS, MODULES } from "@/features/company/options";

// Modules that have a page. Add yours when its page exists (see features/README.md).
const MODULES_WITH_PAGE = ["infrastructure", "marketing", "product"];

type Props = { companyId: string };

// The company's four assessments. A card becomes a link once its module has a page.
export function ModuleCards({ companyId }: Props) {
  return (
    <section aria-labelledby="assessments-heading" className="flex flex-col gap-4">
      <h2 id="assessments-heading" className="text-lg font-bold text-neutral-900">
        Assessments
      </h2>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {MODULES.map((module) => {
          const card = (
            // A row on phones so four cards don't make a long column; a column from sm up
            <div className="flex h-full gap-4 p-5 sm:flex-col">
              <ModuleIcon module={module} />
              <div className="flex flex-1 flex-col gap-1">
                <h3 className="font-bold text-neutral-900">{MODULE_LABELS[module]}</h3>
                <p className="text-sm text-neutral-600 sm:mb-4">{MODULE_DESCRIPTIONS[module]}</p>
                <p className="mt-2 flex items-center gap-2 text-sm text-neutral-600 sm:mt-auto sm:border-t sm:pt-4">
                  <span aria-hidden="true" className="size-2 rounded-full bg-neutral-550" />
                  Not started
                </p>
              </div>
            </div>
          );

          return (
            <li key={module} className="rounded-xl border">
              {MODULES_WITH_PAGE.includes(module) ? (
                <Link
                  href={`/companies/${companyId}/${module}`}
                  className="block h-full rounded-xl transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  {card}
                </Link>
              ) : (
                card
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
