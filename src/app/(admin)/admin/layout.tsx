import { AdminNav } from "@/components/shared/admin-nav";
import { AppLogo } from "@/components/shared/app-logo";
import { requireAdmin } from "@/lib/dal";
import { UserMenu } from "@/features/auth/components/user-menu";

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  // A founder gets a 404 on every admin URL. Each data.ts function checks again.
  const admin = await requireAdmin();

  return (
    <div className="flex flex-1 flex-col">
      {/* One row from md; on phones the tabs drop to a second row under the logo and menu */}
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-4 gap-y-1 px-4 py-1.5 md:px-10 md:py-2.5">
          <div className="flex items-center gap-2.5">
            <AppLogo />
            <span className="rounded-md bg-neutral-100 px-2 py-1 text-xs font-semibold text-neutral-700">
              Admin
            </span>
          </div>
          <AdminNav />
          <div className="ml-auto md:ml-0">
            <UserMenu name={admin.name} email={admin.email} isAdmin isCompact />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 p-6 md:p-10">{children}</main>
    </div>
  );
}
