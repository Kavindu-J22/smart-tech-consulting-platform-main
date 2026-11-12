import type { Metadata } from "next";
import Link from "next/link";
import { AppButton } from "@/components/shared/app-button";
import { PageHeader } from "@/components/shared/page-header";
import { getCompany } from "@/features/company/data";
import {
  OPERATING_MODE_LABELS,
  PRODUCT_TYPE_LABELS,
  STAGE_LABELS,
} from "@/features/company/options";
import { CompanyDetails } from "@/features/company/components/company-details";
import { CompanyMenu } from "@/features/company/components/company-menu";
import { ModuleCards } from "@/features/company/components/module-cards";

export async function generateMetadata({
  params,
}: PageProps<"/companies/[companyId]">): Promise<Metadata> {
  const { companyId } = await params;
  const company = await getCompany(companyId);
  return { title: company.name };
}

export default async function CompanyPage({ params }: PageProps<"/companies/[companyId]">) {
  const { companyId } = await params;
  const company = await getCompany(companyId);
  // A one-line reminder of what the assessments are tailored to
  const summary = [
    STAGE_LABELS[company.stage],
    PRODUCT_TYPE_LABELS[company.productType],
    OPERATING_MODE_LABELS[company.operatingMode],
    company.industry,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="flex flex-col gap-10">
      <PageHeader title={company.name} description={summary}>
        <AppButton variant="secondary" asChild>
          <Link href={`/companies/${company.id}/edit`}>Edit details</Link>
        </AppButton>
        <CompanyMenu companyId={company.id} companyName={company.name} />
      </PageHeader>
      <ModuleCards companyId={company.id} />
      <CompanyDetails company={company} />
    </div>
  );
}
