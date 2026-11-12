import {
  GEOGRAPHIC_FOCUS_LABELS,
  OPERATING_MODE_LABELS,
  PRODUCT_TYPE_LABELS,
  STAGE_LABELS,
} from "@/features/company/options";

type Props = {
  company: {
    stage: string;
    productType: string;
    operatingMode: string;
    industry: string | null;
    geographicFocus: string | null;
    budgetLkr: number | null;
  };
};

export function CompanyDetails({ company }: Props) {
  const rows = [
    { label: "Stage", value: STAGE_LABELS[company.stage] },
    { label: "Product type", value: PRODUCT_TYPE_LABELS[company.productType] },
    { label: "How the team works", value: OPERATING_MODE_LABELS[company.operatingMode] },
    { label: "Industry", value: company.industry },
    {
      label: "Geographic focus",
      value: company.geographicFocus && GEOGRAPHIC_FOCUS_LABELS[company.geographicFocus],
    },
    {
      label: "Budget",
      value: company.budgetLkr === null ? null : `LKR ${company.budgetLkr.toLocaleString("en-LK")}`,
    },
  ];

  return (
    <section aria-labelledby="details-heading" className="flex flex-col gap-2">
      <h2 id="details-heading" className="text-lg font-bold text-neutral-900">
        Company details
      </h2>
      <dl className="grid gap-x-12 sm:grid-cols-2">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between gap-4 border-b py-3">
            <dt className="text-neutral-600">{row.label}</dt>
            {row.value ? (
              <dd className="text-right font-medium text-neutral-900">{row.value}</dd>
            ) : (
              <dd className="text-right text-neutral-600">Not set</dd>
            )}
          </div>
        ))}
      </dl>
    </section>
  );
}
