import type { Metadata } from "next";
import Link from "next/link";
import { AppButton } from "@/components/shared/app-button";
import { PageHeader } from "@/components/shared/page-header";
import { QUESTIONNAIRES } from "@/features/product/config/questions";
import { getProductAssessment } from "@/features/product/data";
import { QuestionnairePending } from "@/features/product/components/questionnaire-pending";

export const metadata: Metadata = { title: "Product assessment" };

export default async function ProductAssessmentPage({
  params,
}: PageProps<"/companies/[companyId]/product/[assessmentId]">) {
  const { companyId, assessmentId } = await params;
  const assessment = await getProductAssessment(companyId, assessmentId);
  const questionnaire = QUESTIONNAIRES[assessment.stage];

  return (
    <div className="flex flex-col gap-10">
      <PageHeader title={questionnaire.title} description={questionnaire.intro}>
        <AppButton variant="secondary" asChild>
          <Link href={`/companies/${companyId}/product`}>Back to product</Link>
        </AppButton>
      </PageHeader>
      <QuestionnairePending />
    </div>
  );
}
