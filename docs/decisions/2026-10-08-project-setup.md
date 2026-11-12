# Decisions: project setup (Phase 1)

**Date**: 2026-10-08

| Decision | Why |
|---|---|
| **Prisma stays on 7.10.0.** On 2026-10-08 `prisma@latest` is still `8.0.0-rc.21` (a release candidate). | The research chose 7.10; an RC has a different API. Moving to 8 is a separate group decision. |
| **Next.js 16.4.0.** | Latest stable at setup time. |
| **`cacheComponents` and `partialPrefetching` turned off.** `create-next-app` 16.4 turns them on by default. | With them on, any page that reads the login session must sit inside its own `<Suspense>` boundary or the build fails. Every page in this app reads the session, so this would add complexity everywhere. The research already said not to use Next caching. |
| **No test runner (Vitest) for now.** | The basics (login, companies, admin uploads) have no scoring logic to test. Add Vitest when the first module's scoring engine is built, so its scores are repeatable for the expert comparison. |
| **shadcn/ui with Radix, preset "Nova"** (Lucide icons). | Radix was chosen in the research. Everyone uses the same base; never re-run `shadcn init` with another base. |
| **Prettier defaults** (double quotes, semicolons), print width 100, Tailwind class sorting. `components/ui/` and `docs/` are not formatted. | One automatic style, so nobody argues about formatting. shadcn files are vendor code. |
