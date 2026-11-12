import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { AppButton } from "@/components/shared/app-button";
import { PageHeader } from "@/components/shared/page-header";
import { countDocuments, listRecentDocuments } from "@/features/knowledge/data";
import { DocumentList } from "@/features/knowledge/components/document-list";
import { ModuleCoverage } from "@/features/knowledge/components/module-coverage";

export const metadata: Metadata = { title: "Admin" };

export default async function AdminPage() {
  const [counts, recent] = await Promise.all([countDocuments(), listRecentDocuments()]);

  return (
    <div className="flex flex-col gap-10">
      <PageHeader title="Overview" description="The published sources the assessments draw on.">
        <AppButton asChild>
          <Link href="/admin/documents/new">
            <Plus aria-hidden="true" strokeWidth={1.5} />
            Add document
          </Link>
        </AppButton>
      </PageHeader>
      <ModuleCoverage counts={counts} />
      <section aria-labelledby="documents-heading" className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between gap-4">
          <h2
            id="documents-heading"
            tabIndex={-1}
            className="text-lg font-bold text-neutral-900 outline-none"
          >
            Recent uploads
          </h2>
          <Link
            href="/admin/documents"
            className="flex h-11 items-center text-sm font-medium text-neutral-700 underline underline-offset-4 hover:text-neutral-900"
          >
            All documents
          </Link>
        </div>
        <DocumentList
          documents={recent}
          emptyMessage="Nothing uploaded yet. The five newest documents show up here."
        />
      </section>
    </div>
  );
}
