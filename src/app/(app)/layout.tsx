import { AppSidebar } from "@/components/shared/app-sidebar";
import { requireUser } from "@/lib/dal";
import { UserMenu } from "@/features/auth/components/user-menu";
import { listCompanies } from "@/features/company/data";

export default async function AppLayout({ children }: LayoutProps<"/">) {
  // For the sidebar only. Each page still checks access through its data.ts calls.
  const user = await requireUser();
  const companies = await listCompanies();

  return (
    <div className="flex flex-1 flex-col md:flex-row">
      <AppSidebar companies={companies}>
        <UserMenu name={user.name} email={user.email} isAdmin={user.role === "admin"} />
      </AppSidebar>
      <main className="mx-auto w-full max-w-5xl flex-1 p-6 md:p-10">{children}</main>
    </div>
  );
}
