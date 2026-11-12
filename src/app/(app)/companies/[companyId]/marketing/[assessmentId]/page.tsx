import type { Metadata } from "next";
import Link from "next/link";
import { AppButton } from "@/components/shared/app-button";
import { PageHeader } from "@/components/shared/page-header";
import { getCompany } from "@/features/company/data";
import { getMarketingAssessment } from "@/features/marketing/data";
import { MarketingWizard } from "@/features/marketing/components/wizard/marketing-wizard";

export const metadata: Metadata = { title: "Marketing Assessment Wizard" };

type Props = {
  params: Promise<{ companyId: string; assessmentId: string }>;
};

export default async function MarketingAssessmentWizardPage({ params }: Props) {
  const { companyId, assessmentId } = await params;
  const company = await getCompany(companyId);
  const assessment = await getMarketingAssessment(companyId, assessmentId);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8">
      <PageHeader
        title="Marketing Strategy Assessment Questionnaire"
        description={`${company.name} • 5-Step Evaluation (Questions Q1–Q21)`}
      >
        <AppButton variant="secondary" asChild>
          <Link href={`/companies/${company.id}/marketing`}>Back to Assessments</Link>
        </AppButton>
      </PageHeader>

      <MarketingWizard
        companyId={company.id}
        assessmentId={assessment.id}
        initialAnswers={(assessment.answers as Record<string, unknown>) || {}}
      />
    </div>
  );
}
