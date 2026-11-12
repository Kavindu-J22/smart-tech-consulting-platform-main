import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { LandingPage } from "@/features/landing/components/landing-page";

export default async function HomePage() {
  // Logged-in founders go straight to their companies; only visitors see the landing page.
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) redirect("/companies");
  return <LandingPage />;
}
