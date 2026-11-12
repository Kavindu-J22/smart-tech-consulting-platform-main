import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { UploadForm } from "@/features/knowledge/components/upload-form";

export const metadata: Metadata = { title: "Add document" };

export default function NewDocumentPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Add document" />
      <UploadForm />
    </div>
  );
}
