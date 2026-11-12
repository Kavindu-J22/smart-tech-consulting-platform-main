import type { Metadata } from "next";
import Link from "next/link";
import { AppButton } from "@/components/shared/app-button";
import { PageHeader } from "@/components/shared/page-header";
import { getCompany } from "@/features/company/data";
import { listMarketingAssessments } from "@/features/marketing/data";
import { AssessmentList } from "@/features/marketing/components/assessment-list";
import { MarketingStart } from "@/features/marketing/components/marketing-start";

export const metadata: Metadata = { title: "Marketing Strategy Assessment" };

type Props = {
  params: Promise<{ companyId: string }>;
};

export default async function MarketingPage({ params }: Props) {
  const { companyId } = await params;
  const company = await getCompany(companyId);
  const assessments = await listMarketingAssessments(companyId);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8">
      <PageHeader
        title="Marketing Strategy Assessment"
        description={`${company.name} • Audience Intelligence, Feature-to-Value, AHP Channels & Budget`}
      >
        <AppButton variant="secondary" asChild>
          <Link href={`/companies/${company.id}`}>Back to company</Link>
        </AppButton>
        {assessments.length > 0 && (
          <AppButton asChild>
            <Link href={`/companies/${company.id}/marketing/new`}>New Assessment</Link>
          </AppButton>
        )}
      </PageHeader>

      {assessments.length > 0 ? (
        <AssessmentList companyId={company.id} assessments={assessments} />
      ) : (
        <MarketingStart companyId={company.id} />
      )}
    </div>
  );
}
