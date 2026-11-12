"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

// Add a page here when the admin area grows. "Back to app" hides on phones, where the logo
// already links to /companies, so the header fits in one slim row.
const ADMIN_LINKS = [{ href: "/admin/documents", label: "Documents" }];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin" className="flex items-center gap-1 text-sm font-medium">
      {ADMIN_LINKS.map((link) => {
        const isActive = pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "rounded-xl px-4 py-3 transition-colors",
              isActive
                ? "bg-lilac-50 text-neutral-900"
                : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900",
            )}
          >
            {link.label}
          </Link>
        );
      })}
      <Link
        href="/companies"
        className="hidden items-center gap-2 rounded-xl px-4 py-3 text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 sm:flex"
      >
        <ArrowLeft className="size-4" strokeWidth={1.5} />
        Back to app
      </Link>
    </nav>
  );
}
