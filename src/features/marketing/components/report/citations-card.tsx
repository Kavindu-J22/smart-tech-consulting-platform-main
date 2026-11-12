import { BookOpen } from "lucide-react";

type Props = {
  citations: string[];
};

export function CitationsCard({ citations }: Props) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-card p-6 shadow-xs">
      <div className="flex items-center gap-2 border-b border-neutral-200 pb-3">
        <BookOpen className="size-4 text-neutral-600" />
        <h3 className="text-sm font-bold text-neutral-900">
          Grounded Sri Lankan Market Evidence & Literature Citations
        </h3>
      </div>
      <p className="text-xs text-neutral-600">
        All market reach rates, cost assumptions, and digital maturity factors utilized in this
        assessment are traceable to published industry benchmarks and regulatory strategies:
      </p>
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
    </div>
  );
}
