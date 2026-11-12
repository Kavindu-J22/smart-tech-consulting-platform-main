import type { Metadata } from "next";
import Link from "next/link";
import { AppButton } from "@/components/shared/app-button";
import { PageHeader } from "@/components/shared/page-header";
import { getCompany } from "@/features/company/data";
import { InfrastructureStart } from "@/features/infrastructure/components/infrastructure-start";

export const metadata: Metadata = { title: "Infrastructure" };

export default async function InfrastructurePage({
  params,
}: PageProps<"/companies/[companyId]/infrastructure">) {
  const { companyId } = await params;
  const company = await getCompany(companyId);

  return (
    <div className="flex flex-col gap-10">
      <PageHeader title="Infrastructure" description={company.name}>
        <AppButton variant="secondary" asChild>
          <Link href={`/companies/${company.id}`}>Back to company</Link>
        </AppButton>
      </PageHeader>
      <InfrastructureStart />
    </div>
  );
}
