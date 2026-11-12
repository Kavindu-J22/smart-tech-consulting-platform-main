import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ASSESSMENT_STATUS_LABELS, PRODUCT_STAGE_LABELS } from "@/features/product/options";
import { cn } from "@/lib/utils";

type Props = {
  companyId: string;
  assessments: { id: string; stage: string; status: string; updatedAt: Date }[];
};

// The company's product assessments, newest first. A draft opens its questions; a completed
// one opens its report.
export function AssessmentList({ companyId, assessments }: Props) {
  return (
    <section aria-labelledby="assessments-heading" className="flex flex-col gap-4">
      <h2 id="assessments-heading" className="text-lg font-bold text-neutral-900">
        Your assessments
      </h2>
      <ul className="flex flex-col divide-y rounded-xl border">
        {assessments.map((assessment) => {
          const isCompleted = assessment.status === "completed";
          const href = `/companies/${companyId}/product/${assessment.id}${isCompleted ? "/report" : ""}`;
          return (
            <li key={assessment.id}>
              <Link
                href={href}
                className="flex items-center gap-4 p-5 transition-colors first:rounded-t-xl last:rounded-b-xl hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                <div className="flex flex-1 flex-col gap-1">
                  <span className="font-bold text-neutral-900">
                    {PRODUCT_STAGE_LABELS[assessment.stage]}
                  </span>
                  <span className="text-sm text-neutral-600">
                    Last saved {assessment.updatedAt.toLocaleDateString("en-LK")}
                  </span>
                </div>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-medium",
                    isCompleted
                      ? "bg-lime-100 text-neutral-900"
                      : "bg-neutral-100 text-neutral-700",
                  )}
                >
                  {ASSESSMENT_STATUS_LABELS[assessment.status]}
                </span>
                <ChevronRight aria-hidden="true" className="size-5 text-neutral-600" />
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
