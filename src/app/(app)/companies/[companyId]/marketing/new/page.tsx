import { redirect } from "next/navigation";
import { getCompany } from "@/features/company/data";
import { createMarketingAssessment } from "@/features/marketing/data";

type Props = {
  params: Promise<{ companyId: string }>;
};

export default async function NewMarketingAssessmentPage({ params }: Props) {
  const { companyId } = await params;
  const company = await getCompany(companyId);

  // Pre-seed contextual fields from company profile where available
  const initialAnswers: Record<string, unknown> = {};
  if (company.name) initialAnswers.productName = company.name;
  if (company.industry) initialAnswers.industry = company.industry;
  if (company.budgetLkr) initialAnswers.monthlyBudgetLkr = company.budgetLkr;

  const assessment = await createMarketingAssessment(company.id, initialAnswers);
  redirect(`/companies/${company.id}/marketing/${assessment.id}`);
}
