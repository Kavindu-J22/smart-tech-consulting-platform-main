import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "@/lib/auth";

// inferAdditionalFields makes `role` part of the user type in the browser too.
export const authClient = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>()],
});
