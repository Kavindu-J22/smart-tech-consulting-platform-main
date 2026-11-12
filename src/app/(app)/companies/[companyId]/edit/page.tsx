import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { getCompany } from "@/features/company/data";
import { CompanySchema } from "@/features/company/schema";
import { CompanyForm } from "@/features/company/components/company-form";

export async function generateMetadata({
  params,
}: PageProps<"/companies/[companyId]/edit">): Promise<Metadata> {
  const { companyId } = await params;
  const company = await getCompany(companyId);
  return { title: `Edit ${company.name}` };
}

export default async function EditCompanyPage({
  params,
}: PageProps<"/companies/[companyId]/edit">) {
  const { companyId } = await params;
  const company = await getCompany(companyId);
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={`Edit ${company.name}`} />
      <CompanyForm companyId={company.id} defaultValues={CompanySchema.parse(company)} />
    </div>
  );
}
