import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCompany } from "@/features/company/data";
import { getMarketingAssessment } from "@/features/marketing/data";
import { MarketingReport } from "@/features/marketing/components/report/marketing-report";
import type { MarketingAnswers, MarketingReport as ReportType } from "@/features/marketing/schema";

export const metadata: Metadata = { title: "Marketing Strategy Results Dashboard" };

type Props = {
  params: Promise<{ companyId: string; assessmentId: string }>;
};

export default async function MarketingReportPage({ params }: Props) {
  const { companyId, assessmentId } = await params;
  await getCompany(companyId);
  const assessment = await getMarketingAssessment(companyId, assessmentId);

  if (!assessment.report) {
    redirect(`/companies/${companyId}/marketing/${assessmentId}`);
  }

  const report = assessment.report as unknown as ReportType;
  const answers = (assessment.answers as unknown as MarketingAnswers) || {};

  return (
    <MarketingReport
      companyId={companyId}
      assessmentId={assessment.id}
      report={report}
      answers={answers}
    />
  );
}
