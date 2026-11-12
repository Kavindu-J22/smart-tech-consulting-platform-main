import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { AppButton } from "@/components/shared/app-button";
import { PageHeader } from "@/components/shared/page-header";
import { countDocuments, listDocuments } from "@/features/knowledge/data";
import { DocumentList } from "@/features/knowledge/components/document-list";
import { ModuleFilter } from "@/features/knowledge/components/module-filter";
import { DOCUMENT_MODULES, DOCUMENT_MODULE_LABELS } from "@/features/knowledge/options";

export const metadata: Metadata = { title: "Documents" };

export default async function DocumentsPage({ searchParams }: PageProps<"/admin/documents">) {
  const { module: param } = await searchParams;
  // An unknown ?module= shows everything instead of an empty list.
  const selected = DOCUMENT_MODULES.find((id) => id === param);
  const [documents, counts] = await Promise.all([listDocuments(selected), countDocuments()]);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Documents" description="Every source uploaded for the assessments.">
        <AppButton asChild>
          <Link href="/admin/documents/new">
            <Plus aria-hidden="true" strokeWidth={1.5} />
            Add document
          </Link>
        </AppButton>
      </PageHeader>
      <section aria-labelledby="documents-heading" className="flex flex-col gap-4">
        <h2 id="documents-heading" tabIndex={-1} className="sr-only">
          {selected ? `${DOCUMENT_MODULE_LABELS[selected]} documents` : "All documents"}
        </h2>
        <ModuleFilter current={selected} counts={counts} />
        <DocumentList
          documents={documents}
          emptyMessage={
            selected
              ? `No ${selected === "shared" ? "shared" : DOCUMENT_MODULE_LABELS[selected]} documents yet.`
              : "No documents yet. Add the first published source to get started."
          }
        />
      </section>
    </div>
  );
}
