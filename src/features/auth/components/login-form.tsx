"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { FieldGroup } from "@/components/ui/field";
import { AppButton } from "@/components/shared/app-button";
import { PageHeader } from "@/components/shared/page-header";
import { TextField } from "@/components/shared/text-field";
import { authClient } from "@/lib/auth-client";
import { LoginSchema, type LoginInput } from "@/features/auth/schema";

export function LoginForm() {
  const router = useRouter();
  const form = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "" },
  });
  const { errors, isSubmitting } = form.formState;

  const onSubmit = form.handleSubmit(async (values) => {
    const { error } = await authClient.signIn.email(values);
    if (error) {
      toast.error(error.message ?? "Could not log in");
      return;
    }
    router.push("/companies");
  });

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Log in" description="Welcome back" />
      <form onSubmit={onSubmit} noValidate>
        <FieldGroup>
          <TextField
            id="email"
            label="Email"
            error={errors.email}
            type="email"
            autoComplete="email"
            {...form.register("email")}
          />
          <TextField
            id="password"
            label="Password"
            error={errors.password}
            type="password"
            autoComplete="current-password"
            {...form.register("password")}
          />
          <AppButton type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting ? "Logging in…" : "Log in"}
          </AppButton>
          <p className="flex flex-wrap items-center justify-center text-sm text-muted-foreground">
            No account yet?
            <Link href="/signup" className="inline-flex h-11 items-center px-2 underline">
              Sign up
            </Link>
          </p>
        </FieldGroup>
      </form>
    </div>
  );
}
