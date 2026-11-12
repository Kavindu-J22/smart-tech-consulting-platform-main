import { ArrowUpRight } from "lucide-react";
import { MODULE_STRONG_COLOURS, ProgressMark } from "@/components/shared/progress-mark";
import { MODULES } from "@/features/company/options";
import { DeleteDocumentButton } from "@/features/knowledge/components/delete-document-button";
import {
  DOCUMENT_MODULE_LABELS,
  SOURCE_TYPE_LABELS,
  STATUS_LABELS,
} from "@/features/knowledge/options";
import { cn } from "@/lib/utils";

// Rows instead of a table: seven columns don't fit on a phone, and a row reads the same everywhere.
// Each row starts with its module's square from the logo (a full mark for shared documents),
// so a mixed list can be scanned by colour.
type Props = {
  documents: {
    id: string;
    title: string;
    module: string;
    sourceType: string;
    status: string;
    createdAt: Date;
    addedBy: { name: string };
  }[];
  emptyMessage: string;
};

export function DocumentList({ documents, emptyMessage }: Props) {
  if (documents.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-neutral-550 p-8 text-center text-neutral-600">
        {emptyMessage}
      </p>
    );
  }

  return (
    <ul className="flex flex-col divide-y rounded-xl border">
      {documents.map((document) => (
        <li key={document.id} className="flex items-center gap-4 py-3 pr-2 pl-5 sm:pl-6">
          <span className="flex w-4 shrink-0 justify-center self-start pt-1.5">
            {document.module === "shared" ? (
              <ProgressMark filled={MODULES} />
            ) : (
              <span
                aria-hidden="true"
                className={cn("size-3 rounded-[3px]", MODULE_STRONG_COLOURS[document.module])}
              />
            )}
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            {/* A plain <a>, not <Link>: it opens a file from a route handler, not a page. */}
            <a
              href={`/api/documents/${document.id}`}
              target="_blank"
              rel="noopener"
              className="group flex w-fit items-start gap-1 font-bold break-words text-neutral-900 underline-offset-4 hover:underline focus-visible:underline"
            >
              {document.title}
              <ArrowUpRight
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-neutral-550 group-hover:text-neutral-900"
                strokeWidth={1.5}
              />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
            <p className="flex flex-wrap items-center gap-x-2 text-sm text-neutral-600">
              <span>{DOCUMENT_MODULE_LABELS[document.module]}</span>
              <span aria-hidden="true">·</span>
              <span>{SOURCE_TYPE_LABELS[document.sourceType]}</span>
              <span aria-hidden="true">·</span>
              <span>
                {document.addedBy.name},{" "}
                {/* Pinned to Sri Lanka: the server runs in UTC and would show yesterday before 5:30 */}
                {document.createdAt.toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  timeZone: "Asia/Colombo",
                })}
              </span>
            </p>
          </div>
          <span className="hidden items-center gap-2 text-sm text-neutral-600 sm:flex">
            <span
              aria-hidden="true"
              className={cn(
                "size-2 rounded-full",
                document.status === "processed" ? "bg-neutral-900" : "bg-neutral-550",
              )}
            />
            {STATUS_LABELS[document.status]}
          </span>
          <DeleteDocumentButton documentId={document.id} title={document.title} />
        </li>
      ))}
    </ul>
  );
}
