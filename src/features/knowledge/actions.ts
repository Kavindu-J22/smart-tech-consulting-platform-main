"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { DocumentSchema, type DocumentInput } from "./schema";
import { createDocument, deleteDocument } from "./data";

// The overview and the library both show documents, so both refresh through the admin layout.

export async function createDocumentAction(input: DocumentInput) {
  await createDocument(DocumentSchema.parse(input));
  revalidatePath("/admin", "layout");
  redirect("/admin/documents");
}

// No redirect: the admin stays on the list they deleted from.
export async function deleteDocumentAction(documentId: string) {
  await deleteDocument(documentId);
  revalidatePath("/admin", "layout");
}
