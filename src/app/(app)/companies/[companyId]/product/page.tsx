import type { Metadata } from "next";
import Link from "next/link";
import { AppButton } from "@/components/shared/app-button";
import { PageHeader } from "@/components/shared/page-header";
import { getCompany } from "@/features/company/data";
import { listProductAssessments } from "@/features/product/data";
import { AssessmentList } from "@/features/product/components/assessment-list";
import { ProductStart } from "@/features/product/components/product-start";

export const metadata: Metadata = { title: "Product" };

export default async function ProductPage({ params }: PageProps<"/companies/[companyId]/product">) {
  const { companyId } = await params;
  const company = await getCompany(companyId);
  const assessments = await listProductAssessments(companyId);

  return (
    <div className="flex flex-col gap-10">
      <PageHeader title="Product" description={company.name}>
        <AppButton variant="secondary" asChild>
          <Link href={`/companies/${company.id}`}>Back to company</Link>
        </AppButton>
        {assessments.length > 0 && (
          <AppButton asChild>
            <Link href={`/companies/${company.id}/product/new`}>New assessment</Link>
          </AppButton>
        )}
      </PageHeader>
      {assessments.length > 0 ? (
        <AssessmentList companyId={company.id} assessments={assessments} />
      ) : (
        <ProductStart companyId={company.id} />
      )}
    </div>
  );
}
