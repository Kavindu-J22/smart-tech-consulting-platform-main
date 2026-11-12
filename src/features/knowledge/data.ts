import "server-only";
import { del } from "@vercel/blob";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/dal";
import type { DocumentInput } from "./schema";

// module is optional: the library page can show one module's documents or all of them.
export async function listDocuments(module?: string) {
  await requireAdmin();
  return db.document.findMany({
    where: module ? { module } : undefined,
    include: { addedBy: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function listRecentDocuments() {
  await requireAdmin();
  return db.document.findMany({
    include: { addedBy: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 5,
  });
}

// One row per module + source type pair, for the overview and the library filter counts.
export async function countDocuments() {
  await requireAdmin();
  return db.document.groupBy({ by: ["module", "sourceType"], _count: { _all: true } });
}

export async function getDocument(documentId: string) {
  await requireAdmin();
  const document = await db.document.findUnique({ where: { id: documentId } });
  if (!document) notFound();
  return document;
}

export async function createDocument(input: DocumentInput) {
  const admin = await requireAdmin();
  try {
    return await db.document.create({ data: { ...input, addedById: admin.id } });
  } catch (error) {
    // The browser uploaded the file before this ran; without a row, nothing would ever delete it.
    await del(input.blobUrl);
    throw error;
  }
}

export async function deleteDocument(documentId: string) {
  await requireAdmin();
  const document = await db.document.findUnique({ where: { id: documentId } });
  if (!document) notFound();
  // The file goes first, so a failed delete never leaves a row pointing at nothing.
  await del(document.blobUrl);
  await db.document.delete({ where: { id: documentId } });
}
