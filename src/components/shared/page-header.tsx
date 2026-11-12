// The heading at the top of every app page, an optional line under it, and the page's
// buttons on the right.
type Props = {
  title: string;
  description?: string;
  children?: React.ReactNode;
};

export function PageHeader({ title, description, children }: Props) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-balance text-neutral-900 sm:text-3xl">
          {title}
        </h1>
        {description && <p className="max-w-2xl text-base text-neutral-600">{description}</p>}
      </div>
      {children && <div className="flex flex-wrap gap-3">{children}</div>}
    </div>
  );
}
