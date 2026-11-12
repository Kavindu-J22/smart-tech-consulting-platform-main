// The prototype's form layout: a white intro column that explains the form, next to the
// fields on a grey panel. The columns sit side by side only on wide screens (xl), because
// below that the form column gets too narrow for three choice cards in a row.
type Props = {
  title: string;
  description: string;
  illustration?: React.ReactNode;
  children: React.ReactNode;
};

export function FormPanel({ title, description, illustration, children }: Props) {
  return (
    <div className="flex flex-col overflow-clip rounded-xl border border-neutral-200 bg-neutral-100 xl:flex-row">
      <div className="border-b border-neutral-200 bg-background px-6 py-8 text-center xl:w-60 xl:shrink-0 xl:border-r xl:border-b-0 xl:py-12">
        {/* Sticky so the explanation stays in view while a long form scrolls past it */}
        <div className="flex flex-col items-center gap-2 xl:sticky xl:top-12">
          <h2 className="text-lg font-bold text-neutral-900">{title}</h2>
          <p className="max-w-60 text-sm leading-relaxed text-neutral-600">{description}</p>
          {illustration && <div className="mt-10 hidden size-48 xl:block">{illustration}</div>}
        </div>
      </div>
      <div className="flex-1 p-5 sm:p-8">{children}</div>
    </div>
  );
}
