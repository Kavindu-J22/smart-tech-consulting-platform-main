import { AppLogo } from "@/components/shared/app-logo";
import { AuthPreview } from "@/features/auth/components/auth-preview";

// Form on the left, an example assessment on the right from lg up. Phones get the form only:
// the example would push the fields a full screen down.
export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex flex-1">
      <main className="flex flex-1 flex-col px-6 py-4 sm:px-10">
        <AppLogo />
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-10">
          {children}
        </div>
      </main>
      <AuthPreview />
    </div>
  );
}
