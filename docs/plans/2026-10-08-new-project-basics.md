# Plan: New Next.js project, the basics

**Date**: 2026-10-08
**Goal**: A new repo where a founder can sign up, log in and manage their companies, and an admin can upload knowledge documents. It sets the folder structure, naming and code style that all four modules will follow.
**Based on**: [research/2026-09-28-nextjs-stack-and-conventions.md](../research/2026-09-28-nextjs-stack-and-conventions.md)
**Replaces**: [2026-09-28-infrastructure-crud-slice.md](2026-09-28-infrastructure-crud-slice.md) for the base setup. The Infrastructure assessment comes after this plan.

**The rules everyone follows** (folders, naming, the CRUD pattern, code style) are in [CONVENTIONS.md](../../CONVENTIONS.md) at the repo root. This file is only the build order.

**Tests:** there's no test runner yet. The basics have no scoring logic to test. Add Vitest when the first module's scoring engine is built (see [decisions/2026-10-08-project-setup.md](../decisions/2026-10-08-project-setup.md)).

# Build phases

Each phase is one branch and one PR (or a few), and finishes with checks you can actually do.

| # | Phase | Result | Status |
|---|---|---|---|
| 1 | New repo, tools and look | Empty app with our theme, checks run on every PR | ✅ done |
| 2 | Database | Tables exist locally | ✅ done (`Company` moved to Phase 3) |
| 3 | Login and roles | Sign up / log in / log out; founder and admin roles | ✅ done |
| 4 | Companies (CRUD) | The example feature everyone copies | ✅ done |
| 5 | Deploy | Live on Vercel; teammates' merges deploy | ⏸ skipped for now (2026-10-09) |
| 6 | Admin area and document upload | Admins upload, list and delete documents | |
| 7 | Module starting point | Four module cards; each member can start their module | ✅ done |

## Phase 1: New repo, tools and look ✅

What was done (2026-10-08):

1. **Versions checked.** Prisma 8 is still a release candidate, so Prisma stays on **7.10.0**. Next.js is **16.4.0**. Recorded in `docs/decisions/2026-10-08-project-setup.md`.
2. **Project created** in `../smart-app` with `create-next-app@16.4.0` (TypeScript, Tailwind, ESLint, App Router, `src/`, `@/*`). Git is initialised.
3. **`cacheComponents` and `partialPrefetching` turned off** in `next.config.ts` (create-next-app turns them on). With them on, every page that reads the login session would need its own `<Suspense>` boundary.
4. **Docs moved:** `docs/research/` and `docs/plans/` were moved here from the prototype folder. `CONVENTIONS.md` is at the root.
5. **Prettier** + `prettier-plugin-tailwindcss` (sorts Tailwind classes). `components/ui/` and `docs/` are skipped.
6. **Scripts:**
   - `typecheck` = `next typegen && tsc --noEmit`
   - `format` = `prettier --write .`
   - `check` = typecheck + lint + `prettier --check .`
7. **ESLint rules that enforce CONVENTIONS.md:**
   - `no-explicit-any` is an error.
   - `../` imports are blocked.
   - One feature importing another is blocked, except `@/features/company/options` and `@/features/company/schema`. Each feature is listed in `FEATURES` in `eslint.config.mjs`.
8. **GitHub Action** `.github/workflows/check.yml` runs `npm ci && npm run check` on every PR and push to `main`.
9. **shadcn/ui:**
   - `npx shadcn@4.21.4 init --base radix --preset nova` (Radix, Lucide icons).
   - Added `button card input label field select radio-group sonner` (`separator` came with `field`).
   - The prototype palette (neutral, lilac, lime, blue, yellow) is in `globals.css`, and shadcn's colour roles point at it: `--primary` = neutral-900, `--accent` = lilac-50, `--ring` = lilac-300, `--radius` = 1rem.
   - Font: Arimo via `next/font/google`. The toast `<Toaster />` is in the root layout.
   - **Add more components only when a phase needs them:** Phase 3 `dropdown-menu`, Phase 4 `table alert-dialog`, Phase 6 `badge`.
10. **`.env.example`** (with `!.env.example` in `.gitignore`), **`.nvmrc`** (Node 24) and a short **`README.md`**.
11. A temporary home page shows a themed card, radio group and buttons. It's replaced in Phase 4.

**Checked:**
- `npm run check` passes.
- The page renders with Arimo and the brand colours.
- A test file importing another feature, `company/data` or `../` fails lint, while `company/options` passes.

**Still to do (needs your accounts):**
- Create the GitHub repo and push.
- Protect `main`: PR required, 1 review, the "Check" workflow must pass.
- Add the 3 teammates.
- Open a test PR to see the Action run.

## Phase 2: Database

1. Install the exact versions (with `-E` so nothing floats):
   ```sh
   npm i -E @prisma/client@7.10.0 @prisma/adapter-pg@7.10.0 pg
   npm i -D -E prisma@7.10.0 tsx
   ```
   Also `npm i -E server-only`, which the Next docs say to install for the `import "server-only"` line.
2. Set up Prisma:
   - `prisma.config.ts` reads `DIRECT_URL`.
   - In `schema.prisma`, the generator is `prisma-client` with `output = "../src/generated/prisma"`. Git-ignore `src/generated/`.
3. Create `src/lib/db.ts`: `import 'server-only'` and one shared `PrismaClient` using `PrismaPg` with `DATABASE_URL`.
4. Local database: run `npx prisma dev` and put its connection string into `DATABASE_URL` and `DIRECT_URL` in `.env.local`.
5. Add the `Company` model:
   ```prisma
   model Company {
     id        String   @id @default(cuid())
     ownerId   String
     owner     User     @relation(fields: [ownerId], references: [id], onDelete: Cascade)
     name      String
     stage     String   // id from features/company/options.ts
     // more company fields (productType, operatingMode, budgetLkr…) are added in Phase 4
     createdAt DateTime @default(now())
     updatedAt DateTime @updatedAt
     @@index([ownerId])
   }
   ```
   `User` arrives in Phase 3, so add `Company` together with the auth tables there if migrating now is awkward.
   **Done that way:** `Company` is added in Phase 3 with the auth tables.
6. Add the scripts:
   - `db:migrate` = `prisma migrate dev`
   - `db:studio` = `prisma studio`
   - `postinstall` = `prisma generate`

**Done when** `npm run db:studio` opens and shows the tables.

## Phase 3: Login and roles

1. Install `better-auth` (exact version from the Phase 1 check).
2. `src/lib/auth.ts`:
   - Better Auth with the Prisma adapter and `emailAndPassword: { enabled: true }`.
   - An extra user field `role`: type string, default `'founder'`, **`input: false`** (so nobody can choose it at sign-up). Confirm the option name in the Better Auth docs.
3. Generate the tables and migrate:
   - Run `npx auth@latest generate` to write `User`, `Session`, `Account` and `Verification` into `schema.prisma`.
   - Check that the output looks like Prisma 7.
   - Add the `Company` model from Phase 2 step 5, and `companies Company[]` to `User`.
   - Run `npm run db:migrate`.
4. Wire up the auth endpoints:
   - `app/api/auth/[...all]/route.ts`: `export const { GET, POST } = toNextJsHandler(auth)`
   - `src/lib/auth-client.ts`: `createAuthClient()`
5. `src/lib/dal.ts`, the only place that decides who may do what:
   ```ts
   export const requireUser = cache(async () => {
     const session = await auth.api.getSession({ headers: await headers() });
     if (!session) redirect('/login');
     return session.user;
   });

   export async function requireCompany(companyId: string) {
     const user = await requireUser();
     const company = await db.company.findFirst({ where: { id: companyId, ownerId: user.id } });
     if (!company) notFound();
     return company;
   }

   export async function requireAdmin() {
     const user = await requireUser();
     if (user.role !== 'admin') notFound();
     return user;
   }
   ```
6. `src/proxy.ts`: if there is no session cookie (`getSessionCookie`), redirect to `/login`. Skip this for `/login`, `/signup` and `/api/auth`. It doesn't touch the database.
7. `features/auth/`: `schema.ts`, plus `components/login-form.tsx` and `signup-form.tsx`. They use the same React Hook Form pattern, call `authClient.signIn.email` / `signUp.email`, then go to `/companies`.
8. `app/(app)/layout.tsx`: a header with the user's name and a logout button. Also add `app/error.tsx` and `app/not-found.tsx`.
9. `scripts/make-admin.ts` + `npm run make-admin <email>`:
   - Sets `role = 'admin'` for that email.
   - It creates its own `PrismaClient`, because `lib/db.ts` is `server-only` and can't be imported by a script.

**Done when:**
- Sign up, log in, refresh (still logged in), log out, then open `/companies` → you're sent to `/login`.
- A sign-up request that includes `role: "admin"` still creates a `founder`.
- `npm run make-admin you@email.com` changes the role (check in Studio).

## Phase 4: Companies (CRUD)

This is the example every other feature copies, so keep it exactly as in CONVENTIONS.md, section 3.

1. Agree the company fields and their choice lists with the group: stage, product type, operating mode, industry, budget. Put them in `features/company/options.ts`, add the columns to `Company`, and migrate.
   **Chosen (2026-10-09):** required `name`, `stage`, `productType`, `operatingMode`; optional `industry` (text), `geographicFocus`, `budgetLkr`. The ids come from the prototype's infrastructure engine, so modules can read them directly.
2. Create `features/company/`:
   - `schema.ts`, `data.ts`, `actions.ts`
   - `components/company-form.tsx`, `company-list.tsx`, `company-details.tsx`, `delete-company-button.tsx`
3. Add the pages:

   | URL | Shows |
   |---|---|
   | `/companies` | My companies + "New company" |
   | `/companies/new` | `CompanyForm` |
   | `/companies/[companyId]` | Details + Edit + Delete |
   | `/companies/[companyId]/edit` | `CompanyForm` filled in |

4. Add a duplicate-name check in `createCompanyAction` that returns `{ error }`, so the "expected error" pattern has a real example.
5. Port the prototype's sidebar and header into `components/shared/` using shadcn parts and theme colours.

**Done when:**
- You can create, view, edit and delete a company, and changes survive a refresh.
- A second account opening the first account's `/companies/<id>` or `/edit` gets a **404**.

## Phase 5: Deploy

1. Create the hosted database: Prisma Postgres in **Singapore**. The pooled string goes in `DATABASE_URL` and the direct string in `DIRECT_URL`.
2. Create the Vercel project from the repo:
   - Add `vercel.json` with `{ "regions": ["sin1"] }`.
   - Set the env vars, including a new `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL` = the live URL.
3. Migrations on deploy: set the build script to `prisma migrate deploy && next build`.
4. Team deploys: on the free (Hobby) plan, only the owner's pushes deploy from a private repo. Pick one:
   - (a) a GitHub Action that deploys with the owner's Vercel token, or
   - (b) Vercel Pro.

   Write the choice in `docs/decisions/`.
5. Create a **Vercel Blob** store (needed in Phase 6) and add `BLOB_READ_WRITE_TOKEN` to Vercel and `.env.local`.
6. Backups: `scripts/db-backup.sh` + `npm run db:backup` (runs `pg_dump` against `DIRECT_URL`). Git-ignore `backups/`.
7. Run `npm run make-admin` against the live database for the four of you.
8. Check whether the database is slow after sitting idle: wait 15+ minutes, time the first page load, and write the number down.

**Done when:**
- Login and companies work on the live URL.
- A teammate's merged PR goes live without the owner doing anything.
- `npm run db:backup` creates a file.

## Phase 6: Admin area and document upload

1. Add the `Document` model and migrate:
   ```prisma
   model Document {
     id         String   @id @default(cuid())
     title      String
     module     String   // infrastructure | marketing | compliance | product | shared
     sourceType String   // peer_reviewed | government | provider | other
     sourceUrl  String?
     fileName   String
     blobUrl    String
     status     String   @default("uploaded") // uploaded → processed (later, when we embed into Pinecone)
     addedById  String
     addedBy    User     @relation(fields: [addedById], references: [id])
     createdAt  DateTime @default(now())
   }
   ```
2. Create `features/knowledge/`, with the same shape as `company`:
   - `options.ts`: `MODULES`, `SOURCE_TYPES` + labels
   - `schema.ts`: `DocumentSchema` (title, module, sourceType, sourceUrl, fileName, blobUrl)
   - `data.ts`: `listDocuments`, `createDocument`, `deleteDocument`. **Each one starts with `requireAdmin()`.** `deleteDocument` also removes the file from Blob.
   - `actions.ts`: `createDocumentAction`, `deleteDocumentAction`
   - `components/`: `document-list.tsx`, `upload-form.tsx`, `delete-document-button.tsx`
3. Add the upload route, `app/api/documents/upload/route.ts`. It uses Vercel Blob's `handleUpload`, and in `onBeforeGenerateToken` it:
   - calls `requireAdmin()`
   - allows only PDF, `.md` and `.txt`
   - sets a 50 MB maximum
4. How the upload works: the file goes from the browser **straight to Blob**, not through our server, which has a 4.5 MB limit.
   1. `upload-form.tsx` calls Blob's `upload(file, { handleUploadUrl: '/api/documents/upload' })`.
   2. Then it calls `createDocumentAction({ title, module, sourceType, sourceUrl, fileName, blobUrl })`.
5. Add the pages:
   - `app/(admin)/admin/layout.tsx`: an admin header with links to "Documents" and "Back to app"
   - `app/(admin)/admin/page.tsx`: redirects to `/admin/documents`
   - `app/(admin)/admin/documents/page.tsx`: `listDocuments()`, the upload form and the list (title, module, source, added by, date, status, delete)
6. Show an "Admin" link in the main header only when `user.role === 'admin'`. The link is only for convenience; the real protection is `requireAdmin()` on every page and data function.
7. Add a warning on the upload form: *"Published sources only. Never upload interview transcripts or participant data."*

**Done when:**
- An admin uploads a PDF bigger than 5 MB and it appears in the list.
- Deleting it removes both the list row and the Blob file.
- A founder gets a **404** on `/admin/documents`, and a direct call to the upload route is refused.

**Later (not in this plan):** reading the PDF text, splitting it into chunks and sending them to Pinecone. That waits for the group's embedding decision. It will change `status` to `processed` without changing the upload page.

## Phase 7: Module starting point ✅

1. `/companies/[companyId]` shows four module cards (Infrastructure, Marketing, Compliance, Product), all marked "Not started".
   **Done early (2026-10-09)** with the company page redesign: `ModuleCards` in `features/company/components/`, and the list is `MODULES` in `features/company/options.ts`. The cards become links as each module is built.
2. Create `features/infrastructure/` with one empty page at `/companies/[companyId]/infrastructure`, following the guideline.
3. Add a short `features/README.md`: "To start your module, copy `infrastructure/`, rename it, and follow `CONVENTIONS.md`."
4. Tell the group: from here, each member builds their own module in their own folder.

**Done (2026-10-09):** the page is `app/(app)/companies/[companyId]/infrastructure/page.tsx`, the empty state is `features/infrastructure/components/infrastructure-start.tsx`, and the guide is `features/README.md`. A module card becomes a link once its name is in `MODULES_WITH_PAGE` in `module-cards.tsx`.

**Done when** a teammate can create their module folder and page from the README alone, without asking you.

---

## Things to check while building

| Phase | Check | If it doesn't work |
|---|---|---|
| 1 | Has Prisma 8 been released? | Stay on 7.10.0 and note it. **Checked 2026-10-09:** only `8.0.0-rc.22`, which lacks `P2002`-style errors and most nested writes, so we stay on 7.10.0. npm's `latest` tag points to the RC, so always install with the pinned version. |
| 3 | Does `npx auth generate` produce a schema Prisma 7 accepts? What is the exact name of the `input: false` option? | Write the auth tables by hand from the Better Auth docs. **Checked 2026-10-09 (better-auth 1.7.7):** yes, and `role` comes out as `String @default("founder")`. The option is `input: false`; a sign-up that sends `role` gets the default. The CLI can't load a file that imports `server-only` (ours and `db.ts` do), so run it on a temporary copy of the auth options with `prismaAdapter({}, …)`. |
| 2–3 | Does `prisma dev` (one connection at a time) work with Better Auth? | Use a local Postgres in Docker |
| 5 | Does a teammate's merge deploy? Is the database slow after being idle? | Switch deploy option; note the delay as a limitation |
| 6 | Should Blob files be private or public, and how does the server read a private one? | Check the `@vercel/blob` docs when building |

## What you need to prepare

- **Before Phase 1:** a GitHub account for the repo, and the agreed repo name (this plan uses `smart-app`).
- **Before Phase 4:** the group agrees on the company fields and their choices. *(Done: see Phase 4 step 1.)*
- **Before Phase 5:** decide who owns the Vercel and Prisma accounts, and choose deploy option (a) or (b).
