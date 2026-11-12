"use client";
import { useState } from "react";
import { Menu } from "lucide-react";
import { AppButton } from "@/components/shared/app-button";
import { AppLogo } from "@/components/shared/app-logo";
import { SidebarNav } from "@/components/shared/sidebar-nav";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

// Ported from the prototype's sidebar. The user menu comes in as children, so this shared
// component doesn't import from a feature.
// On phones the full sidebar would push every page ~300px down (more with each company),
// so below md it becomes a slim top bar and the same links open in a slide-in menu.
type Props = {
  companies: { id: string; name: string }[];
  children: React.ReactNode;
};

export function AppSidebar({ companies, children }: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 flex items-center justify-between border-b bg-background px-4 py-1.5 md:hidden">
        <AppLogo />
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <AppButton variant="ghost" className="size-11 px-0" aria-label="Open menu">
              <Menu className="size-5" />
            </AppButton>
          </SheetTrigger>
          <SheetContent side="left" aria-describedby={undefined} className="gap-6 p-6">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <AppLogo />
            <div className="-mx-2 overflow-y-auto">
              <SidebarNav companies={companies} onNavigate={() => setIsMenuOpen(false)} />
            </div>
            <div className="mt-auto">{children}</div>
          </SheetContent>
        </Sheet>
      </header>

      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col gap-6 overflow-y-auto border-r bg-background p-6 md:flex">
        <AppLogo />
        <SidebarNav companies={companies} />
        <div className="mt-auto">{children}</div>
      </aside>
    </>
  );
}
