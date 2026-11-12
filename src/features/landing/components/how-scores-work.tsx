// The method, for founders who want to know whether to trust a number. Plain rows, not cards:
// it's a sequence, read left to right.
const STEPS = [
  {
    title: "Your answers",
    text: "Your company's stage and product type, then each module's questions. Every answer is a fixed choice, not free text.",
  },
  {
    title: "Rules as data",
    text: "Criteria, weights and thresholds are plain data files. Each entry records where it came from: research papers, expert interviews or AHP.",
  },
  {
    title: "Same input, same score",
    text: "A plain calculation turns answers into scores. Nothing random and nothing learned, so you can check every step.",
  },
  {
    title: "Explained afterwards",
    text: "An AI writes the explanation once the score exists. It can't change a number, and it never sees your company name.",
  },
];

const LOCAL_FACTS = [
  "TRCSL tariffs for connection costs",
  "Local data centres and hosting",
  "CEB power context for backup plans",
  "Sri Lankan legal and registration steps",
];

export function HowScoresWork() {
  return (
    <section
      aria-labelledby="method-heading"
      className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 py-20 md:px-10 lg:py-28"
    >
      <div className="flex flex-col gap-10">
        <div className="flex max-w-2xl flex-col gap-3">
          <h2
            id="method-heading"
            className="text-2xl font-bold tracking-tight text-balance text-neutral-900 sm:text-3xl"
          >
            The rules decide the score. The AI only explains it.
          </h2>
          <p className="text-base text-neutral-600">
            Every number on your company page can be traced back to the rule and the source that
            made it.
          </p>
        </div>
        <ol className="grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <li key={step.title} className="flex flex-col gap-2 border-t border-neutral-900 pt-5">
              <h3 className="font-bold text-neutral-900">{step.title}</h3>
              <p className="text-sm text-pretty text-neutral-600">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="grid gap-6 border-t pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16">
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-bold text-neutral-900">Built on Sri Lankan facts</h2>
          <p className="text-sm text-neutral-600">
            Costs are in LKR, and every reference number shows its source and date.
          </p>
        </div>
        <ul className="grid divide-y sm:grid-cols-2 sm:gap-x-8 sm:divide-y-0">
          {LOCAL_FACTS.map((fact) => (
            <li key={fact} className="py-3 text-base text-neutral-900 sm:border-b">
              {fact}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
