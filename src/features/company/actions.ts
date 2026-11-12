"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { CompanySchema, type CompanyInput } from "./schema";
import { listCompanies, createCompany, updateCompany, deleteCompany } from "./data";

export async function createCompanyAction(input: CompanyInput) {
  const values = CompanySchema.parse(input);
  // A mistake a normal user can make, so it's returned as a message instead of thrown.
  const companies = await listCompanies();
  if (companies.some((company) => company.name === values.name)) {
    return { error: "You already have a company with this name" };
  }
  const company = await createCompany(values);
  // The sidebar in the (app) layout lists companies, and a redirect alone doesn't refresh layouts.
  revalidatePath("/", "layout");
  redirect(`/companies/${company.id}`);
}

export async function updateCompanyAction(companyId: string, input: CompanyInput) {
  const values = CompanySchema.parse(input);
  // Same check as create, but the company may keep its own name.
  const companies = await listCompanies();
  if (companies.some((company) => company.id !== companyId && company.name === values.name)) {
    return { error: "You already have a company with this name" };
  }
  await updateCompany(companyId, values);
  revalidatePath("/", "layout");
  redirect(`/companies/${companyId}`);
}

export async function deleteCompanyAction(companyId: string) {
  await deleteCompany(companyId);
  revalidatePath("/", "layout");
  redirect("/companies");
}
