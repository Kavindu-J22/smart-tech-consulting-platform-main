import Link from "next/link";
import { AppButton } from "@/components/shared/app-button";
import { PageHeader } from "@/components/shared/page-header";
import { ModuleIcon } from "@/components/shared/module-icon";
import { MODULE_DESCRIPTIONS, MODULE_LABELS, MODULES } from "@/features/company/options";

// What a founder sees before they have a company: what the app does and the one next step.
export function CompanyWelcome() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        title="Add your first company"
        description="Smart checks how ready your startup is to launch. Tell us about your company once, and each of the four assessments is tailored to it."
      />
      <ul className="grid gap-6 sm:grid-cols-2">
        {MODULES.map((module) => (
          <li key={module} className="flex items-start gap-4">
            <ModuleIcon module={module} />
            <div className="flex flex-col gap-1">
              <p className="font-bold text-neutral-900">{MODULE_LABELS[module]}</p>
              <p className="text-sm text-neutral-600">{MODULE_DESCRIPTIONS[module]}</p>
            </div>
          </li>
        ))}
      </ul>
      <AppButton size="lg" asChild className="self-start">
        <Link href="/companies/new">Add your first company</Link>
      </AppButton>
    </div>
  );
}
