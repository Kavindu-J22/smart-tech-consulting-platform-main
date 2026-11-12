import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  companyId: string;
  assessments: {
    id: string;
    status: string;
    answers: unknown;
    report: unknown;
    createdAt: Date;
    updatedAt: Date;
  }[];
};

export function AssessmentList({ companyId, assessments }: Props) {
  return (
    <section aria-labelledby="marketing-assessments-heading" className="flex flex-col gap-4">
      <h2 id="marketing-assessments-heading" className="text-lg font-bold text-neutral-900">
        Marketing Assessments
      </h2>
      <ul className="flex flex-col divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-card shadow-xs">
        {assessments.map((assessment) => {
          const isCompleted = assessment.status === "completed";
          const href = `/companies/${companyId}/marketing/${assessment.id}${isCompleted ? "/report" : ""}`;
          const answers = (assessment.answers as Record<string, unknown>) || {};
          const productName = (answers.productName as string) || "Untitled Product Campaign";

          return (
            <li key={assessment.id}>
              <Link
                href={href}
                className="flex items-center gap-4 p-5 transition-colors first:rounded-t-xl last:rounded-b-xl hover:bg-neutral-50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                <div className="flex flex-1 flex-col gap-1">
                  <span className="font-bold text-neutral-900">{productName}</span>
                  <span className="text-sm text-neutral-500">
                    Last updated{" "}
                    {assessment.updatedAt.toLocaleDateString("en-LK", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                    isCompleted ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800",
                  )}
                >
                  {isCompleted ? "Completed Report" : "Draft (In Progress)"}
                </span>
                <ChevronRight aria-hidden="true" className="size-5 text-neutral-400" />
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
