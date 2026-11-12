import { z } from "zod";

export const LoginSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(1, "Enter your password"),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export const SignupSchema = z.object({
  name: z.string().trim().min(1, "Enter your name"),
  email: z.email("Enter a valid email"),
  // Better Auth's own minimum is 8, so we check the same here and show it under the field.
  password: z.string().min(8, "Use at least 8 characters"),
});

export type SignupInput = z.infer<typeof SignupSchema>;
