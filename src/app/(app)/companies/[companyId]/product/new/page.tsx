import type { Metadata } from "next";
import Link from "next/link";
import { AppButton } from "@/components/shared/app-button";
import { PageHeader } from "@/components/shared/page-header";
import { getCompany } from "@/features/company/data";
import { StagePicker } from "@/features/product/components/stage-picker";

export const metadata: Metadata = { title: "New product assessment" };

export default async function NewProductAssessmentPage({
  params,
}: PageProps<"/companies/[companyId]/product/new">) {
  const { companyId } = await params;
  const company = await getCompany(companyId);

  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        title="Let’s understand your product"
        description="Select the option that best describes the current stage of your product or service."
      >
        <AppButton variant="secondary" asChild>
          <Link href={`/companies/${company.id}/product`}>Cancel</Link>
        </AppButton>
      </PageHeader>
      <StagePicker companyId={company.id} />
    </div>
  );
}
