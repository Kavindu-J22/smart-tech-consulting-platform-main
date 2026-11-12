"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { StageSchema, type StageInput } from "./schema";
import { createProductAssessment } from "./data";

export async function createProductAssessmentAction(companyId: string, input: StageInput) {
  const assessment = await createProductAssessment(companyId, StageSchema.parse(input));
  revalidatePath("/", "layout");
  redirect(`/companies/${companyId}/product/${assessment.id}`);
}
