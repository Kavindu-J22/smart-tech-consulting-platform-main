import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { CompanyForm } from "@/features/company/components/company-form";

export const metadata: Metadata = { title: "New company" };

export default function NewCompanyPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="New company" />
      <CompanyForm />
    </div>
  );
}
