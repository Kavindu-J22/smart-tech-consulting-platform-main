import { BookOpen, ExternalLink, Database, AlertCircle } from "lucide-react";
import type { RetrievedEvidenceItem } from "@/features/marketing/schema";

type Props = {
  citations: string[];
  retrievedEvidence?: RetrievedEvidenceItem[];
  evidenceSource?: string;
  evidenceNamespace?: string;
};

export function CitationsCard({
  citations,
  retrievedEvidence,
  evidenceSource,
  evidenceNamespace,
}: Props) {
  const hasRetrievedEvidence = Array.isArray(retrievedEvidence) && retrievedEvidence.length > 0;
  const isPinecone = evidenceSource === "pinecone_rag";

  return (
    <div className="flex flex-col gap-5 rounded-xl border border-neutral-200 bg-card p-6 shadow-xs">
      <div className="flex flex-col justify-between gap-3 border-b border-neutral-200 pb-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <BookOpen className="size-4 text-neutral-600" />
          <h3 className="text-sm font-bold text-neutral-900">
            Grounded Sri Lankan Market Evidence & Literature Citations
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-700">
            <Database className="size-3 text-neutral-500" />
            {isPinecone
              ? `Pinecone RAG (${evidenceNamespace || "marketing-kalana-v1"})`
              : evidenceSource === "local_dataset_fallback"
                ? "Verified Local Dataset Fallback"
                : "Public Grounding Baseline"}
          </span>
        </div>
      </div>

      <p className="text-xs text-neutral-600">
        All market reach rates, cost suitability indices, and digital maturity factors utilized in
        this assessment are grounded in verified public-source Sri Lankan platform statistics and
        regulatory records.
      </p>

      {hasRetrievedEvidence ? (
        <div className="grid grid-cols-1 gap-3">
          {retrievedEvidence.map((item) => (
            <div
              key={item.id}
              className="border-neutral-150 flex flex-col justify-between rounded-lg border bg-neutral-50/50 p-3.5 text-xs text-neutral-800"
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-neutral-900 px-2 py-0.5 font-mono text-[11px] font-bold text-white">
                      {item.id}
                    </span>
                    <span className="font-semibold text-neutral-900">{item.title}</span>
                  </div>
                  <span className="rounded bg-neutral-200 px-2 py-0.5 text-[11px] font-medium text-neutral-700">
                    {item.publisher} • {item.observedPeriod}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-neutral-700">
                  <strong className="text-neutral-900">Evidence Claim:</strong> {item.claim}
                </p>
                {item.caveat && (
                  <div className="mt-2 flex items-start gap-1.5 text-[11px] text-amber-800">
                    <AlertCircle className="mt-0.5 size-3 shrink-0 text-amber-600" />
                    <span>
                      <strong>Caution / Scope:</strong> {item.caveat}
                    </span>
                  </div>
                )}
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-neutral-200 pt-2 text-[11px]">
                <span className="text-neutral-500 italic">
                  Decision use: {item.decisionUse || "Contextual background"}
                </span>
                {item.sourceUrl && (
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1 font-medium text-neutral-900 underline hover:text-emerald-700"
                  >
                    View Source Document
                    <ExternalLink className="size-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <ul className="space-y-2">
          {citations.map((cite, idx) => (
            <li
              key={idx}
              className="border-neutral-150 flex items-start gap-2 rounded-lg border bg-neutral-50/60 p-2.5 text-xs text-neutral-700"
            >
              <span className="shrink-0 font-mono font-bold text-neutral-400">[{idx + 1}]</span>
              <span className="flex-1">{cite}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
