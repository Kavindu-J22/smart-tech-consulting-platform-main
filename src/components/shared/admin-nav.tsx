"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

// The admin pages' tabs, styled like the app sidebar's items so both areas feel like one app.
// "Back to app" sits at the far end, away from the tabs, because it leaves the admin area.
const LINKS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/documents", label: "Documents" },
] as const;

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Admin"
      className="order-last flex w-full items-center gap-1 md:order-none md:w-auto md:flex-1"
    >
      {LINKS.map((link) => {
        // Overview only matches itself; Documents also matches /admin/documents/new.
        const isActive =
          link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex h-11 items-center rounded-xl px-4 text-sm font-medium transition-colors",
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
        className="ml-auto flex h-11 items-center gap-2 rounded-xl px-3 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
      >
        <ArrowLeft aria-hidden="true" className="size-4" strokeWidth={1.5} />
        Back to app
      </Link>
    </nav>
  );
}
