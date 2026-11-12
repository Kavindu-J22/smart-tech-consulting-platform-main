"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

// The company list from the prototype's sidebar. Shown in the desktop sidebar and in the
// phone menu; the phone menu passes onNavigate so it can close when a link is tapped.
type Props = {
  companies: { id: string; name: string }[];
  onNavigate?: () => void;
};

export function SidebarNav({ companies, onNavigate }: Props) {
  const pathname = usePathname();
  const isNewActive = pathname === "/companies/new";

  return (
    <nav aria-label="Companies" className="flex flex-col gap-1">
      <p className="mb-1 px-4 py-2 text-xs font-bold tracking-wider text-neutral-600 uppercase">
        My companies
      </p>
      {companies.map((company) => {
        const isActive = pathname.startsWith(`/companies/${company.id}`);
        return (
          <Link
            key={company.id}
            href={`/companies/${company.id}`}
            onClick={onNavigate}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
              isActive
                ? "bg-lilac-50 text-neutral-900"
                : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900",
            )}
          >
            <span
              className={cn(
                "flex size-6 shrink-0 items-center justify-center rounded-md",
                isActive && "bg-neutral-900 text-neutral-0",
              )}
            >
              <Briefcase className="size-4" strokeWidth={1.5} />
            </span>
            <span className="truncate">{company.name}</span>
          </Link>
        );
      })}
      <Link
        href="/companies/new"
        onClick={onNavigate}
        aria-current={isNewActive ? "page" : undefined}
        className={cn(
          "mt-2 flex items-center gap-3 rounded-xl border border-dashed px-4 py-3 text-sm font-semibold transition-colors",
          isNewActive
            ? "border-neutral-600 bg-neutral-50 text-neutral-900"
            : "border-neutral-550 text-neutral-600 hover:border-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
        )}
      >
        <span className="flex size-6 items-center justify-center rounded-md border border-neutral-200 bg-neutral-0 text-neutral-900">
          <Plus className="size-4" strokeWidth={1.5} />
        </span>
        New company
      </Link>
    </nav>
  );
}
