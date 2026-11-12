# Research: Next.js stack, conventions, forms and UI kit

**Question**: The group wants auth and a real database. Should we move to Next.js + Prisma + a hosted Postgres on Vercel? If so, what folder structure, Next.js practices, form handling and UI-kit choice (shadcn or not) should everyone follow?
**Date**: 2026-09-28
**Constraints**: 4 members, one module each, following KISS. The existing Vite prototype is about 3.6k lines, all client-side state. Scoring must stay deterministic, with Gemini writing prose only (see [2026-09-28-tech-stack-and-infrastructure-plan.md](2026-09-28-tech-stack-and-infrastructure-plan.md), Part 3, which still applies).
**Path**: `docs/research/2026-09-28-nextjs-stack-and-conventions.md`
**Supersedes**: Part 1 (stack) and 2.1 (folder structure) of the earlier plan. The core rules (2.2), styling (2.4) and the infrastructure module plan (Part 3) still apply.

## Summary

1. **Stack:** Next.js 16 (App Router, `src/`) + Prisma ORM **7.10** + **Prisma Postgres (Singapore region)** + Better Auth + shadcn/ui + React Hook Form + Zod, deployed on Vercel with functions in **`sin1`**.
2. **Transactions are not a blocker on either Prisma Postgres or Neon.** Neon's *HTTP* driver only does non-interactive (batched) transactions. Its WebSocket `Pool`/`Client` gives full session and transaction support. Prisma Postgres is a normal TCP Postgres (`@prisma/adapter-pg`), so everything works. We choose **Prisma Postgres** because it keeps one vendor with the ORM, has a Singapore region (the closest to Sri Lanka) and its free plan doesn't mention sleeping. The free plan has **no backups**, though, so we take our own dumps.
3. **⚠ Pin Prisma 7.** On npm, `prisma@latest` is currently **`8.0.0-rc.17`**, a release candidate with a completely new API. `7.10.0` is tagged `prev`. A plain `npm i prisma` would install the RC. Pin `prisma@7.10.0` + `@prisma/client@7.10.0` + `@prisma/adapter-pg@7.10.0`.
4. **Next.js practices we adopt:** Server Components read data through a **server-only Data Access Layer (DAL)**. **Server Actions** do mutations and stay thin, calling the DAL. **Route Handlers** are only for the auth endpoint and file downloads. `proxy.ts` does an optimistic cookie check, and the real auth + ownership check happens in the DAL on every call. We don't use Next caching features.
5. **Forms: one pattern everywhere.** React Hook Form + `zodResolver` + shadcn `Field` components on the client. On submit, the **typed object** goes to a Server Action, which **re-validates with the same Zod schema** (`Schema.parse`). Expected failures return `{ error }`, and everything else throws to `error.tsx`. This handles the multi-step questionnaire with conditional questions; plain `FormData` + `useActionState` does not.
6. **shadcn/ui: yes.** Its components are copied into our repo (we own the code), it has native Tailwind v4 support, it provides accessible radio groups, selects, dialogs and tabs, and its docs cover React Hook Form. We theme it with the prototype's existing colours and treat `components/ui` as vendor code.
7. **The team deploy issue is still open.** On Vercel Hobby only the owner's commits deploy for a private repo. Use a GitHub Action that deploys with the owner's token, or upgrade to Pro.

---

## Findings

### 1. Database: Prisma Postgres vs Neon, and the transaction question

| | Prisma Postgres (Free) | Neon (Free) |
|---|---|---|
| Limits | 500 MB, 200k operations/month, 50 databases [Prisma pricing] | 0.5 GB/project, 100 CU-hours/project [Neon pricing] |
| Sleep | Not mentioned on the pricing page | Suspends after 5 min idle, cannot be turned off, so cold starts happen [Neon pricing] |
| Backups | **None on Free** [Prisma pricing] | Restore/snapshots not on Free [Neon pricing] |
| Region near LK | `ap-southeast-1` Singapore [Prisma create-db docs] | (not checked) |
| Connection | Standard `postgres://` over TCP; pooled host for the app, direct host for migrations; "Any PostgreSQL client works" [Prisma Postgres docs] | Serverless driver over HTTP or WebSockets [Neon driver docs] |
| Interactive transactions | Yes (normal TCP Postgres through `@prisma/adapter-pg`) | **HTTP mode:** "single, non-interactive transaction" only. **WebSocket `Pool`/`Client`:** "session and transaction support" [Neon driver docs] |

So the transaction concern is only true for Neon's HTTP mode, not Neon in general. Either would work. **Prisma Postgres** is the simpler choice for us.

Our load is tiny: 30–50 respondents × 4 modules × a few saves is a few thousand operations, against a free allowance of 200k per month. We barely need transactions. Completing an assessment is a single `update`. If we ever need several writes to succeed or fail together, `$transaction` works.

**Setup facts to follow** [Prisma Postgres connection docs; Prisma 7 upgrade guide]:
- `DATABASE_URL` = **pooled** string (runtime) and `DIRECT_URL` = **direct** string (migrations, Prisma Studio, `pg_dump`). `prisma.config.ts` points at `DIRECT_URL`.
- Prisma 7 needs a `prisma.config.ts`, a **driver adapter** (`@prisma/adapter-pg`), the `prisma-client` generator with a **required `output`** path, and imports from that path instead of `@prisma/client`.
- Use one `PrismaClient` singleton (`src/lib/db.ts`). Without it, each warm serverless call opens a new connection.
- **Backups:** add `npm run db:backup` (a `pg_dump` against `DIRECT_URL`) and run it before every evaluation session.
- **Vercel region:** new projects run functions in `iad1` (Washington). Hobby allows **one** region, and it can be changed [Vercel regions]. Set `"regions": ["sin1"]` in `vercel.json` so the functions sit next to the Singapore DB.

### 2. Next.js practices we adopt (Next.js 16.3 docs)

| Concern | Rule | Source |
|---|---|---|
| Reading data | Server Components call **DAL** functions directly. Never `fetch` our own API from the server. | Data security guide: "For new projects, we recommend creating a dedicated Data Access Layer" |
| DAL | `import 'server-only'`. Every function checks auth + authorization and returns a **minimal DTO**, never raw Prisma rows. | Data security guide |
| Mutations | Server Actions (`'use server'` files) stay **thin**: parse → call DAL → `revalidatePath`/`refresh()` → return nothing, or `{ error }` for expected failures. | Mutating data; Data security ("`use server` actions stay thin") |
| Security | Treat each Server Action as a public POST endpoint: re-check the session **and ownership** (IDOR) inside the DAL, even when the page already checked. | Forms guide warning; Authentication guide |
| Route protection | `proxy.ts` only reads the cookie (optimistic redirect to `/login`). **No DB calls in proxy.** Don't rely on layouts for auth checks, because they don't re-render on navigation. | Authentication guide ("Optimistic checks with Proxy", "Layouts and auth checks") |
| Route Handlers | Only for `/api/auth/[...all]` (Better Auth), CSV export, and the Blob upload-token route `/api/knowledge/upload`. | Our choice. Route handlers are for HTTP endpoints. |
| Secrets | Only server files read `process.env`. Never prefix a secret with `NEXT_PUBLIC_` (those are sent to the browser). | Data security guide |
| Caching | Don't enable Cache Components or `'use cache'`. Route Handlers aren't cached by default. After mutations, call `revalidatePath`/`refresh()`. | Route handlers docs; Mutating data |
| Client components | Add `'use client'` only on interactive leaves (wizard, charts). Pages stay Server Components and pass DTOs down as props. | Auth guide ("Client Components can't import the DAL") |
| Long jobs | The Gemini report is a Server Action called with a pending state. Hobby functions can run up to 300 s [Vercel Hobby]. | |

### 3. Folder structure

The Next docs are "unopinionated" and say to "choose a strategy that works for you and your team and be consistent" [Project structure]. We use their **"store project files outside of `app`"** strategy, organised by feature:

- **`app/` holds only routing files** (`page`, `layout`, `loading`, `error`, `route`), and each one is a few lines that import from `features/`.
- **Each member owns one `features/<module>` folder**, so they rarely touch shared files.

```
smart/
├─ prisma/
│  ├─ schema.prisma
│  └─ migrations/
├─ prisma.config.ts
├─ vercel.json                         # { "regions": ["sin1"] }
├─ scripts/                            # ingest-kb.ts, run-scenarios.ts, evaluate.ts, db-backup.sh
├─ docs/  research/  decisions/
└─ src/
   ├─ proxy.ts                         # optimistic cookie check → /login
   ├─ app/                             # ROUTING ONLY
   │  ├─ layout.tsx  globals.css
   │  ├─ (auth)/login/page.tsx
   │  ├─ (auth)/signup/page.tsx
   │  ├─ (app)/layout.tsx              # shell: sidebar + header
   │  ├─ (app)/page.tsx                # my companies
   │  ├─ (app)/companies/new/page.tsx
   │  ├─ (app)/companies/[companyId]/page.tsx                    # overview: 4 module cards
   │  ├─ (app)/companies/[companyId]/edit/page.tsx
   │  ├─ (app)/companies/[companyId]/infrastructure/page.tsx     # wizard (start/resume draft)
   │  ├─ (app)/companies/[companyId]/infrastructure/[assessmentId]/page.tsx  # results + plan + report
   │  ├─ (app)/companies/[companyId]/marketing/…  compliance/…  product/…
   │  ├─ (app)/companies/[companyId]/dashboard/page.tsx
   │  ├─ (admin)/admin/…               # researcher views: all assessments, exports, scenarios
   │  └─ api/
   │     ├─ auth/[...all]/route.ts     # Better Auth handler
   │     ├─ export/route.ts            # CSV download (admin only)
   │     └─ knowledge/upload/route.ts  # Vercel Blob upload token (researchers only)
   ├─ components/
   │  ├─ ui/                           # shadcn-generated (vendor code, see §5)
   │  └─ shared/                       # our composites: page-header, step-wizard, choice-cards,
   │                                   #   question-field, score-card, readiness-badge
   ├─ features/
   │  ├─ company/                      # shared company (everyone depends on it)
   │  ├─ dashboard/
   │  ├─ knowledge/                    # shared RAG knowledge base: ingest.ts, search.ts, admin upload page components
   │  └─ infrastructure/               # ← one module = one owner
   │     ├─ config/                    # DATA: criteria.ts weights.ts rules.ts questions.ts plan-rules.ts
   │     ├─ engine/                    # PURE: assess.ts plan.ts + *.test.ts (no Prisma/fetch/LLM)
   │     ├─ reference/                 # trcsl-tariffs.json data-centres.json hardware-prices.json
   │     ├─ schema.ts                  # zod: InfraContext, InfraAnswers, InfraResult, InfraReport
   │     ├─ data.ts                    # 'server-only' DAL for this module
   │     ├─ actions.ts                 # 'use server' thin actions
   │     ├─ report.ts                  # 'server-only' RAG + Gemini
   │     └─ components/                # infrastructure-wizard.tsx, context-step.tsx, needs-step.tsx,
   │                                   #   questions-step.tsx, results-view.tsx
   └─ lib/
      ├─ db.ts                         # Prisma singleton ('server-only')
      ├─ auth.ts  auth-client.ts       # Better Auth server / browser client
      ├─ dal.ts                        # requireUser(), requireCompanyAccess(companyId)
      ├─ llm/gemini.ts  llm/pinecone.ts   # 'server-only'
      └─ utils.ts                      # cn() (shadcn)
```

**Import rules**, which keep the layers honest:
- `engine/` and `config/` import nothing from `lib/`, `data.ts` or `report.ts`. Being pure is what makes the score reproducible.
- `components/` (client) import from `schema.ts`, `config/`, `engine/` and `actions.ts`, but never from `data.ts`, `lib/db.ts` or `lib/llm`. `server-only` makes the build fail if someone tries.
- A feature never imports from another feature, except that `company` and `dashboard` read the shared `ModuleResult` contract.

### 4. Forms

**Decision:** use **React Hook Form + `zodResolver` + shadcn `Field`** for every form, and submit a typed object to a Server Action.

**Why not the Next.js-docs pattern** (`<form action>` + `FormData` + `useActionState`) [Forms guide]: it works well for flat forms. Our main form, though:
- is a multi-step wizard
- has conditional questions (`showIf(context)`)
- needs live weight previews while typing
- has nested answers

With `FormData`, all of this becomes string parsing and loses instant validation. Having two patterns would break KISS, so we use one pattern for everything, including login and the company form.

The shadcn docs show this exact pattern: `Controller` + `Field`/`FieldLabel`/`FieldError`, `zodResolver`, and a `RadioGroup` wired to `field.value`/`field.onChange` [shadcn RHF docs].

**The contract: no helper, no result wrapper, three rules.**

1. **Validate with `Schema.parse(input)`.** The form already validates on the client with the *same* schema (`zodResolver`), so a real user never sends invalid data. If `parse` fails on the server, someone bypassed the UI, and throwing is correct.
2. **Expected failures return `{ error: '…' }`.** These are failures a normal user can cause, like a duplicate name. The Next docs say to "model expected errors as return values" [Next.js error handling].
3. **Everything else throws** (not logged in, not the owner, database down). An error thrown inside `startTransition` "will bubble up to the nearest error boundary" (`error.tsx`) [Next.js error handling].

```ts
// src/features/company/schema.ts
export const CompanySchema = z.object({ /* name, stage, productType, … */ });
export const UpdateCompanySchema = CompanySchema.extend({ companyId: z.string() });
export type UpdateCompanyInput = z.input<typeof UpdateCompanySchema>;
```

```ts
// src/features/company/actions.ts
'use server';
import { revalidatePath } from 'next/cache';
import { UpdateCompanySchema, type UpdateCompanyInput } from './schema';
import { updateCompany } from './data'; // DAL: checks session + ownership, throws if not allowed

export async function updateCompanyAction(input: UpdateCompanyInput) {
  const { companyId, ...company } = UpdateCompanySchema.parse(input);
  await updateCompany(companyId, company);
  revalidatePath(`/companies/${companyId}`);
}
```

```tsx
// client side (inside a 'use client' component)
const form = useForm({ resolver: zodResolver(CompanySchema), defaultValues });
const [pending, startTransition] = useTransition();
const onSubmit = form.handleSubmit((values) =>
  startTransition(() => updateCompanyAction({ companyId, ...values })),
);
```

Only when an action has an expected failure does it return something:

```ts
export async function createCompanyAction(input: CompanyInput) {
  const data = CompanySchema.parse(input);
  if (await hasCompanyNamed(data.name)) return { error: 'You already have a company with this name.' };
  const company = await createCompany(data);
  redirect(`/companies/${company.id}`);
}
// client: const res = await createCompanyAction(values); if (res?.error) toast.error(res.error);
```

Notes:
- **Put `companyId` in the schema** instead of passing it as a separate argument, so it is validated too. Ownership is still checked in the DAL.
- **The action's parameter is typed (`z.input<…>`),** so the client gets autocomplete. The server still runs `parse`, because types don't exist at runtime.

**Questionnaire specifics (infrastructure and every other module):**
- **One `useForm` for the whole wizard.** Before moving to the next step, call `form.trigger(fieldsOfThisStep)`.
- **The questions are data.** `questions-step.tsx` maps `config/questions.ts` → `<QuestionField question={q} />`, which picks radio/number/select by `q.type`. Adding a question means editing the config only.
- **Save drafts.** Each "Next" click calls `saveDraftAction(assessmentId, partialValues)` (status `DRAFT`), so a refresh or a closed laptop during a SUS session loses nothing.
- **Submit.** `completeAssessmentAction` re-validates, **re-runs the engine on the server**, stores `result` + `engineVersion`, sets status `COMPLETED`, and redirects to the results page.
- **Auth forms** use the same RHF + Field UI, but call Better Auth's browser client (`authClient.signIn.email`, and similar). If sign-in is ever done from a Server Action instead, Better Auth needs its `nextCookies()` plugin, or the cookies won't be set [Better Auth Next.js docs].

### 5. shadcn/ui: yes, with rules

**Why:**
- Components are copied into `components/ui`, so "the code you end up with is exactly what you'd write yourself".
- The CLI supports **Tailwind v4 `@theme`/`@theme inline`**, and theming uses CSS variables such as `--primary` and `--background` [shadcn Tailwind v4 docs].
- It gives us accessible primitives the prototype hand-rolls (`RadioPill`, the tabs) and a documented forms story.
- `npx shadcn@latest init` creates `components.json` and `lib/utils.ts` (`cn()`). At init you choose **Radix UI or Base UI** [shadcn Next.js install]. Pick **Radix** (the long-standing option with the most examples), and never mix the two.

**Rules:**
1. Treat `components/ui/*` as **vendor code**. Only the theme changes its look. Don't restyle it per page. Build our composites (`choice-cards`, `question-field`, `score-card`, `step-wizard`) in `components/shared/`.
2. **Theme once in `globals.css`:** map the prototype's palette into shadcn variables (`--primary` = neutral-900 `#3C3C3C`, `--accent` = lilac, success = lime, `--radius` ≈ 16px) and load **Arimo via `next/font/google`**. Hex values appear nowhere else.
3. **Add components only when needed.** The likely set is: `button card input label field radio-group select checkbox progress tabs badge alert dialog sonner table skeleton separator tooltip chart`.
4. **Charts:** use shadcn `chart` (Recharts) for the dashboard (the per-module bars, and a radar chart for the 4 modules). Icons: keep `lucide-react`.

### 6. Auth (Better Auth + Prisma)

- Setup: `betterAuth({ database: prismaAdapter(prisma, { provider: 'postgresql' }), emailAndPassword: { enabled: true } })`. The route is `src/app/api/auth/[...all]/route.ts` → `export const { GET, POST } = toNextJsHandler(auth)` [Better Auth Prisma adapter; Next.js integration].
- Generate the auth tables with `npx auth@latest generate`. This edits `schema.prisma` but **doesn't migrate**, so run `prisma migrate dev` afterwards [Better Auth Prisma adapter].
- Server session: `auth.api.getSession({ headers: await headers() })`, wrapped in `requireUser()` in `lib/dal.ts` with React `cache()`.
- In `proxy.ts`, `getSessionCookie` "only checks for cookie existence; it does **not** validate it". That is fine for redirects only [Better Auth Next.js docs].
- **Roles:** `founder` (default) and `researcher` (admin pages: all assessments, CSV export, scenario runner). Add `role` as an extra field on the user.

### 7. Data model (Prisma, first cut)

```prisma
// Better Auth adds User, Session, Account, Verification via `npx auth@latest generate`.
// Add to User:  role String @default("founder")   companies Company[]

enum ModuleKey { INFRASTRUCTURE MARKETING COMPLIANCE PRODUCT }
enum AssessmentStatus { DRAFT COMPLETED }

model Company {
  id              String   @id @default(cuid())
  ownerId         String
  owner           User     @relation(fields: [ownerId], references: [id])
  name            String
  // shared company fields: real columns so we can run descriptive stats and all modules read the same values
  stage           String   // values come from src/features/company/schema.ts (single source of truth)
  productType     String
  operatingMode   String
  industry        String?
  geographicFocus String?
  budgetLkr       Int?
  assessments     Assessment[]
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  @@index([ownerId])
}

model Assessment {
  id            String           @id @default(cuid())
  companyId     String
  company       Company          @relation(fields: [companyId], references: [id], onDelete: Cascade)
  module        ModuleKey
  status        AssessmentStatus @default(DRAFT)
  inputs        Json             // module-specific; validated by that module's zod schema
  result        Json?            // engine output (score 0–100, gaps, plan items)
  engineVersion String?
  report        Report?
  createdAt     DateTime         @default(now())
  updatedAt     DateTime         @updatedAt
  @@index([companyId, module])
}

model Report {
  id            String     @id @default(cuid())
  assessmentId  String     @unique
  assessment    Assessment @relation(fields: [assessmentId], references: [id], onDelete: Cascade)
  content       Json       // zod-validated InfraReport etc.
  model         String     // e.g. "gemini-3.8-flash"
  promptVersion String
  createdAt     DateTime   @default(now())
}
```

The company fields that every module uses are real columns. Each module's own data is `Json`, so a teammate can change their questions **without a migration**. Company values are strings validated by the Zod enum in `features/company/schema.ts`, not Prisma enums, so adding an option doesn't need a migration either.

### 8. Tooling and conventions (additions to the earlier doc)

- **Scaffold:** `create-next-app` with TypeScript, Tailwind, ESLint, App Router, `src/` and the `@/*` alias. Add Prettier + `prettier-plugin-tailwindcss` for consistent class order. Use Vitest for `engine/` only.
- **Scripts:** `dev`, `build`, `check` (typecheck + lint + test + prettier --check), `db:migrate`, `db:studio`, `db:backup`.
- **Naming:** kebab-case file names (as shadcn does) and PascalCase component exports. Server Actions are named `somethingAction`. DAL functions are plain verbs (`getCompany`, `saveDraft`).
- **Env:** `.env.local` (git-ignored) holds `DATABASE_URL`, `DIRECT_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `GEMINI_API_KEY`, `PINECONE_API_KEY`, `PINECONE_INDEX`, `BLOB_READ_WRITE_TOKEN`. Keep a committed `.env.example` with the same keys and no values.
- **Deploy:** GitHub → Vercel, region `sin1`. On Hobby, "only the account owner can trigger deployments". For a private repo, the pusher must be the Hobby owner or a Pro member [Vercel KB]. Options: (a) a GitHub Action that runs `vercel build` / `vercel deploy --prebuilt` with the owner's token (documented in [Vercel for GitHub]), or (b) Pro at $20 per developer seat per month [Vercel Hobby].

### 9. Revised iteration 0 (migration from the Vite prototype)

| Step | Done when |
|---|---|
| 1. `create-next-app` in a new branch, add Prettier/Vitest, `git init` + GitHub | `npm run check` green on an empty app |
| 2. `shadcn init` (Radix), theme from the current `index.css` palette + Arimo | A test page shows themed Button/Card/RadioGroup |
| 3. Prisma 7.10 + Prisma Postgres (Singapore), schema above, first migration, `db.ts` singleton | `db:studio` shows the tables |
| 4. Better Auth (email/password) + login/signup pages + `proxy.ts` + `lib/dal.ts` | Can't reach `/companies/*` when logged out, and a second account can't open the first account's company |
| 5. Port the shell (sidebar/tabs) + company CRUD + company form (RHF pattern) | A company saves and survives a refresh |
| 6. Move the infra engine into `features/infrastructure/{config,engine}` with tests | Engine tests pass, and the wizard shows the live weights |
| 7. Deploy (Vercel `sin1`, GitHub Action) | A teammate's merged PR deploys |

After step 5, the other three members can port their modules into `features/<module>` using the infrastructure folder as the template. Part 3 of the earlier plan (questions, N4 plan, RAG/Gemini, evaluation) then continues unchanged, except that its storage layer is now Prisma instead of SQLite.

### 10. Infrastructure data flow and the knowledge base

**End-to-end flow:**

```
Company (shared form)                    → Company row
  │
  ▼  /companies/[id]/infrastructure  (one React Hook Form for the whole wizard)
1 Context step     infra-only extras (users, budget, location, current setup …)
2 Needs step       engine.applicability() + engine.weights() run IN THE BROWSER (pure) → live preview
3 Questions step   questions from config/questions.ts, filtered by applicable criteria + showIf
                   each "Next" → saveDraftAction → Assessment.inputs (status DRAFT)
4 Complete         completeAssessmentAction → Schema.parse → engine.assess() ON THE SERVER
                   → Assessment.result + engineVersion (status COMPLETED) → redirect
  │
  ▼  /companies/[id]/infrastructure/[assessmentId]  (Server Component, reads via DAL)
5 Results          scores, gaps, priorities, plan items with LKR costs from reference/*.json
6 Report           "Generate explanation" → generateReportAction:
                     gaps → Gemini embed → Pinecone query (filter: module) → top 5 chunks
                     → Gemini writes prose from result JSON + chunks → zod check → Report row
                     (Gemini/Pinecone fails → template text; scores are never affected)
  │
  ▼
7 Dashboard        latest COMPLETED assessment per module → ModuleResult
```

**Two kinds of "real data", stored in two different places:**

| Data | Examples | Stored in | Used by | Why |
|---|---|---|---|---|
| **Structured facts** | TRCSL tariffs, hardware prices, data-centre specs | Versioned JSON in `features/infrastructure/reference/`, with source + date on every value | The **engine** (costs, plan items) | Numbers must be exact and reproducible. A similarity search can return the wrong or an outdated price. |
| **Unstructured sources** | Papers, TRCSL/ICTA reports, provider docs, guidelines | **Vector DB** (+ a `KnowledgeDocument` row in Postgres) | The **report text** only, with citations | Grounds the explanations. It never touches scores. |

**Do we need a vector DB?** Yes, but only for step 6. Scoring and planning work without it.
- **Keep Pinecone** (the group's decision in the methodology). Use one index shared by all 4 modules, with metadata `module` set to `infrastructure`, `marketing`, and so on, or `shared`.
- **Alternative considered: pgvector in Prisma Postgres.** It is supported [Prisma Postgres extensions]. However, with Prisma 7 the vector column is `Unsupported` and "must be queried with raw SQL", and Prisma Studio can't display those tables. That is less readable than Pinecone's SDK, so we don't use it.
> **Deferred (2026-09-28):** the embedding provider may change (OpenAI or another model), and Docling may run in a small separate Python project. Everything below about embeddings, PDF extraction and uploads is a **provisional proposal**. Nothing gets built until iteration 5. Keep the model name and dimension in one config file so switching providers only means re-embedding.

**Proposal: embedding model and vector size**

| Setting | Value | Why |
|---|---|---|
| Model | **`gemini-embedding-2`** | Stable/GA. Its **8,192-token** input limit is 4× that of `gemini-embedding-001` (2,048), so chunks never get cut off. It **normalises automatically** at smaller sizes, whereas `-001` needs manual normalisation code [Gemini embeddings]. |
| Dimension | **768** | One of the three recommended sizes. The docs' MTEB score is 67.99 at 768 vs 68.17 at 1536, nearly the same quality at half the storage [Gemini embeddings]. |
| Pinecone index | Serverless, `dimension: 768`, `metric: 'cosine'`, one index `smart-kb` for all 4 modules | Created once by a script. Starter (free) gives 2 GB [Pinecone pricing]. At about 4 KB per chunk (vector + text), that's hundreds of thousands of chunks, far more than we need. |
| Cost | Text costs $0.20 per 1M tokens on the paid tier [Gemini pricing] | 100 papers × 20 pages is roughly 1.5M tokens, about $0.30. The free tier also works, because these are published sources. |

**Rules for using it (from the docs, easy to get wrong):**
- `-2` has no `taskType`. Put the instruction in the text: documents are embedded as `title: {title} | text: {chunk}` and queries as `task: search result | query: {question}` [Gemini embeddings].
- Passing several texts inside one `contents` returns **one combined embedding**. To get one embedding per chunk, pass each chunk as its own `Content` object [Gemini embeddings].
- Model name, dimension and index name live in **one file** (`features/knowledge/config.ts`). Changing any of them means re-embedding everything, so it's a group decision.

**Proposal: file → text**

| Input | Tool | Notes |
|---|---|---|
| Text-based PDF (most papers and TRCSL/ICTA reports) | **`unpdf`** | MIT, pure JavaScript, "serverless build of Mozilla's PDF.js", works on Vercel with no native dependencies. `extractText(pdf, { mergePages: true })` [unpdf]. |
| `.md` / `.txt` | none | Read the file as it is. |
| Scanned (image-only) PDF | **rejected in v1** | unpdf does no OCR [unpdf]. If a PDF gives almost no text (< ~100 characters per page), show "This PDF looks scanned. Convert it to Markdown first (see Docling below) and upload the .md." |

**Docling: not inside the app, but fine as an optional offline tool.**
- Docling is strong: layout and reading order, table structure, OCR for scanned files, and export to Markdown/JSON [Docling].
- But it is **Python-only** (3.10+) with no JavaScript client, and it relies on ML models [Docling]. Putting it in the app would mean a second language and a separate Python service (`docling-serve`) next to our Next.js project. That breaks KISS, and it can't run inside our Node functions.
- Our knowledge base only feeds *explanatory prose*. The numbers that matter (tariffs, prices) are hand-curated in `reference/*.json`, so we don't need perfect table extraction.
- **Escape hatch, with zero app code:** for a scanned or table-heavy PDF, a researcher runs the Docling CLI on their own laptop to get Markdown, then uploads the `.md` through the normal page.

**Upload interface: a small researcher-only page.** This is a shared feature, `src/features/knowledge/`, not part of the infrastructure module. It's worth a page because four people add sources, and for the thesis you need a visible record of *what* is in the knowledge base and where each item came from.

- `/admin/knowledge` lists the documents: title, module, source type, peer-reviewed yes/no, URL, chunk count, who added it, and when. It has an upload form and a delete button.
- **Never upload interview transcripts or anything with participant data.** The knowledge base is for published sources only (ethics section: anonymisation).

**How the upload works (and why the 4.5 MB limit doesn't matter):**
- The limit is real: a request to a Vercel Function can carry at most **4.5 MB** [Vercel function limits], and a Server Action accepts 1 MB by default [Next.js serverActions].
- Production apps don't send files *through* their functions. The browser uploads **directly to object storage** (S3 presigned URLs, or Vercel Blob "client uploads"), and the server only hands out a short-lived upload token and later reads the file from storage [Vercel KB: bypass body limit; Vercel Blob client uploads]. Vercel Blob accepts files up to 5 TB [Vercel Blob pricing].

```
Browser ── 1. ask for upload token ──▶ /api/knowledge/upload (handleUpload: researcher? PDF/MD/TXT? ≤ 50 MB?)
Browser ── 2. file goes straight to ──▶ Vercel Blob (private store)
Browser ── 3. ingestDocumentAction({ blobUrl, title, module, sourceType, sourceUrl }) ──▶ server
Server  ── 4. read file from Blob → unpdf → chunks → gemini-embedding-2 → Pinecone upsert → KnowledgeDocument row
```

- Step 1 is a Route Handler, because the Blob SDK's `handleUpload` needs one. That makes our Route Handler list: auth, CSV export, and file upload.
- Check the researcher role in `onBeforeGenerateToken`. The docs say that without this check "anyone can upload files to your Blob store" [Vercel Blob client uploads].
- We call the ingest Server Action from the client after `upload()` resolves, instead of using `onUploadCompleted`. That callback can't reach `localhost` without a tunnel [Vercel Blob client uploads], and calling the action ourselves is simpler.
- Keeping the original file in Blob gives provenance for the thesis. Hobby includes 1 GB of Blob storage [Vercel Blob pricing].
- **Time:** a 200-page report takes seconds to extract and embed, well inside the 300 s Hobby limit.

**One function does the work, and the page and the `npm run kb:ingest <file>` script both call it:**

```ts
// src/features/knowledge/ingest.ts
import 'server-only';

export async function ingestDocument(doc: NewKnowledgeDocument, text: string) {
  const chunks = splitIntoChunks(text);              // ~1,000 chars, split on paragraphs
  const vectors = await embedDocuments(doc.title, chunks);  // gemini-embedding-2, one Content per chunk
  const saved = await db.knowledgeDocument.create({ data: { ...doc, chunkCount: chunks.length } });

  await pinecone.upsert({
    records: chunks.map((chunk, i) => ({
      id: `${saved.id}#${i}`,
      values: vectors[i],
      metadata: { documentId: saved.id, module: doc.module, title: doc.title, text: chunk },
    })),
  });
}
```

- **Deleting** a document removes the vector ids `${id}#0 … #${chunkCount - 1}`, the Blob file, and then the row.

```prisma
model KnowledgeDocument {
  id           String   @id @default(cuid())
  title        String
  module       String   // "infrastructure" | "marketing" | "compliance" | "product" | "shared"
  sourceType   String   // "peer-reviewed" | "government" | "provider" | "other"
  sourceUrl    String?
  blobUrl      String   // original file in Vercel Blob
  chunkCount   Int
  addedById    String
  createdAt    DateTime @default(now())
}
```

**Build order:** add this in iteration 5 (RAG + Gemini report). Build `ingestDocument` and the script first, then the upload page.

---

## Open questions / limitations

- **Better Auth + Prisma 7.10 compatibility:** the adapter docs show the setup but don't state a Prisma version. Confirm when installing. If `npx auth generate` produces a Prisma-8-style schema, stop and check.
- **Whether Prisma Postgres Free sleeps or has cold starts** isn't stated on the pricing page. Measure it in iteration 0, because it affects the < 3 s response-time metric.
- **Vercel Hobby deploy restriction for *public* repos** was not confirmed. The KB article only discusses private repos.
- **Neon + Prisma adapter transaction behaviour** wasn't checked in detail, because we're not choosing Neon.
- **Next.js 16 ESLint command** (whether `next lint` still exists) wasn't checked. Use the ESLint setup `create-next-app` generates.
- **Radix vs Base UI** is a preference call, not a researched one. Either is fine as long as the whole group uses the same one.
- **Embedding choice (`gemini-embedding-2`, 768, cosine)** is decided here but must be confirmed by the group **before anyone ingests**. If a teammate already built a Pinecone index with another model or size, re-embed now while the knowledge base is small.
- **Reading private blobs on the server:** the exact `@vercel/blob` call for downloading a *private* blob wasn't checked. Confirm it when building iteration 5.
- **Scanned-PDF threshold** (< ~100 characters per page) is a heuristic. Tune it on real files.

## Sources

- [Neon serverless driver](https://neon.com/docs/serverless/serverless-driver): official; HTTP = non-interactive transactions, WebSocket Pool/Client = session + transaction support
- [Neon pricing](https://neon.com/pricing): official; Free limits, scale-to-zero after 5 min
- [Prisma pricing](https://www.prisma.io/pricing): official; Free = 500 MB, 200k ops/month, 50 DBs, no backups
- [Prisma Postgres overview](https://www.prisma.io/docs/postgres) and [Connecting to Prisma Postgres](https://www.prisma.io/docs/postgres/database/connecting-to-your-database): official; standard TCP Postgres, pooled vs direct, `@prisma/adapter-pg`, singleton
- [Prisma create-db / regions](https://www.prisma.io/docs/postgres/npx-create-db): official; `ap-southeast-1` Singapore
- [Upgrading to Prisma 7](https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-versions/upgrading-to-prisma-7): official; config file, driver adapters, `prisma-client` generator, required `output`
- [Prisma ORM docs home](https://www.prisma.io/docs/orm): official; "Prisma ORM 8 is the current release, as a release candidate"
- npm registry `npm view prisma dist-tags` (2026-09-28): `latest: 8.0.0-rc.17`, `prev: 7.10.0`. Other versions: next 16.3.6, @prisma/client 7.10.0, @prisma/adapter-pg 7.10.0, better-auth 1.7.6, react-hook-form 7.89.0, @hookform/resolvers 5.9.1, shadcn 4.21.0
- [Next.js project structure](https://nextjs.org/docs/app/getting-started/project-structure): official (v16.3.6); route groups, private folders, organisation strategies
- [Next.js forms guide](https://nextjs.org/docs/app/guides/forms): official; Server Actions, zod `safeParse`, `useActionState`, auth warning
- [Next.js data security](https://nextjs.org/docs/app/guides/data-security): official; DAL, DTOs, `server-only`, Server Actions as public endpoints
- [Next.js authentication](https://nextjs.org/docs/app/guides/authentication): official; optimistic proxy checks, DAL `verifySession`, layout caveat, auth library list
- [Prisma Postgres extensions](https://www.prisma.io/docs/postgres/database/postgres-extensions): official; `vector` supported, raw SQL only, Prisma Studio can't show vector columns
- [Next.js serverActions config](https://nextjs.org/docs/app/api-reference/config/next-config-js/serverActions): official; 1 MB default `bodySizeLimit`
- [Vercel function limits](https://vercel.com/docs/functions/limitations): official; 4.5 MB request body, 300 s on Hobby
- [Gemini embeddings](https://ai.google.dev/gemini-api/docs/embeddings): official; `gemini-embedding-2` GA, 8,192 input tokens, 128–3072 dims, auto-normalisation, query/document prompt format, one-embedding-per-Content rule, MTEB by dimension
- [Gemini pricing](https://ai.google.dev/gemini-api/docs/pricing): official; Embedding 2 text $0.20 / 1M tokens
- [Pinecone pricing](https://www.pinecone.io/pricing/): official; Starter = 2 GB, 2M write units, 1M read units per month
- [unpdf](https://github.com/unjs/unpdf): official repo; MIT, serverless PDF.js build, no OCR
- [Docling](https://github.com/docling-project/docling): official repo; Python 3.10+, layout/tables/OCR, docling-serve, no JS client
- [Vercel KB: bypass the 4.5 MB body limit](https://vercel.com/kb/guide/how-to-bypass-vercel-body-size-limit-serverless-functions): official; upload directly to storage from the browser
- [Vercel Blob client uploads](https://vercel.com/docs/vercel-blob/client-upload): official; `upload()` + `handleUpload`, auth in `onBeforeGenerateToken`, callback not reachable on localhost
- [Vercel Blob pricing and limits](https://vercel.com/docs/vercel-blob/usage-and-pricing): official; Hobby 1 GB storage, 2,000 advanced ops/month, max file 5 TB
- [Next.js error handling](https://nextjs.org/docs/app/getting-started/error-handling): official; expected errors as return values, thrown errors in `startTransition` reach `error.tsx`
- [Next.js mutating data](https://nextjs.org/docs/app/getting-started/mutating-data) and [Route Handlers](https://nextjs.org/docs/app/getting-started/route-handlers): official; `refresh`/`revalidatePath`, Route Handlers not cached by default
- [Better Auth: Prisma adapter](https://www.better-auth.com/docs/adapters/prisma) and [Next.js integration](https://www.better-auth.com/docs/integrations/next): official; setup, `toNextJsHandler`, `getSessionCookie` caveat, `nextCookies()`
- [Auth.js home](https://authjs.dev/): "The Auth.js project is now part of Better Auth"
- [shadcn/ui React Hook Form](https://ui.shadcn.com/docs/forms/react-hook-form), [Tailwind v4](https://ui.shadcn.com/docs/tailwind-v4), [Next.js install](https://ui.shadcn.com/docs/installation/next): official
- [Vercel Hobby plan](https://vercel.com/docs/plans/hobby), [Function regions](https://vercel.com/docs/functions/configuring-functions/region), [Vercel for GitHub](https://vercel.com/docs/git/vercel-for-github), [Why aren't commits triggering deployments](https://vercel.com/kb/guide/why-aren-t-commits-triggering-deployments-on-vercel), [Postgres on Vercel](https://vercel.com/docs/postgres): official
