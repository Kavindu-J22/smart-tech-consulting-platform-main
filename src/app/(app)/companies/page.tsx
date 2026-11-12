import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { listCompanies } from "@/features/company/data";
import { CompanyWelcome } from "@/features/company/components/company-welcome";

export const metadata: Metadata = { title: "Get started" };

export default async function CompaniesPage() {
  const companies = await listCompanies();
  if (companies.length > 0) redirect(`/companies/${companies[0].id}`);
  return <CompanyWelcome />;
}
