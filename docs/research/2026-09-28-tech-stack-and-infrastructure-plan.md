# Research: Tech stack, project standards and end-to-end plan for the Infrastructure module

> **Partly superseded (2026-09-28):** the group moved to Next.js + Prisma + Postgres. The stack (Part 1) and folder structure (2.1) in this document are replaced by [2026-09-28-nextjs-stack-and-conventions.md](2026-09-28-nextjs-stack-and-conventions.md). The core rules (2.2), coding and styling standards (2.3–2.5) and the whole infrastructure module plan (Part 3) still apply. Where Part 3 says SQLite, read Prisma.

**Question**: (1) Which tech stack should the Startup Launch-Readiness platform use, given that it must follow KISS so any group member can change it? (2) Which project standards (structure, styling, core concepts) should everyone follow? (3) How do we build the Infrastructure Readiness & Scalability Advisor (N1 + N4) end to end?
**Date**: 2026-09-28
**Constraints**: Existing Google AI Studio prototype in this folder (Vite 6 + React 19 + TypeScript 5.8 + Tailwind 4, `@google/genai` 2.4 and `express` 4 installed but unused). Local Node is v24.13.1. Methodology fixes: deterministic rule-based scoring with no LLM in the scoring path, Gemini only for explanations, shared RAG on Pinecone + Gemini Embedding, Sri Lankan reference data, and evaluation by κ, MAE, SUS and a response time under 3 s.
**Path**: `docs/research/2026-09-28-tech-stack-and-infrastructure-plan.md`

## Summary

1. **Keep the stack the prototype already has and add as little as possible.** That means React 19 + Vite + TypeScript + Tailwind 4 on the front end, plus **one small Express 5 server** that holds the API keys, runs the scoring engine as the source of truth, and stores data in **one SQLite file** (built into Node through `node:sqlite`). Only three libraries are added: `zod`, `@pinecone-database/pinecone` and `vitest`.
2. **A server is required, not optional.** Google's SDK README says to "avoid exposing API keys in client-side code", and Vite bundles any `VITE_*` variable into the browser. The Gemini and Pinecone keys therefore have to live on the server.
3. **The core concept is "rules are data, the engine is a pure function, the LLM only writes prose."** Criteria, weights, multipliers, questions, thresholds and reference prices live in plain TypeScript/JSON data files. Each entry records where it came from. A pure `assess()` function turns context + answers into scores, gaps and plan items. Gemini only turns that result into readable text. This design is what makes κ/MAE evaluation reproducible and lets non-developers edit weights.
4. **Use one folder per module (`shared/infrastructure/`, `src/features/infrastructure/`)** plus a shared `ModuleResult` contract for the dashboard. Each member then works in their own folder and merge conflicts become rare.
5. **The prototype has integration problems to fix first.** It is not a git repo. The company form and the infrastructure module use different values for the same fields ("Pre-launch" vs `prelaunch`, "B2B SaaS" vs `saas`). The infrastructure context is hard-coded rather than read from the company. Criteria are self-rated 0–5 instead of being scored from specific questions. Nothing is saved. TypeScript is not strict (21 `any`), and 16 class names use hard-coded hex colours.
6. **Gemini facts that changed recently:** the current stable text model is `gemini-3.8-flash`. The **Interactions API** (`ai.interactions.create`) is the recommended API, and `generateContent` is "legacy" but still supported. The Gemini **free tier lets Google use prompts and responses and have humans review them**. We must therefore send only anonymised, scored data to Gemini and never company names. This also supports the ethics section.
7. **Build in 8 short iterations.** The first four (foundation, N1 engine, questions, persistence) need no AI at all. RAG and Gemini come after the scoring is correct and tested, and evaluation tooling (scenario runner, MAE/κ script, CSV export) is built into the app rather than done by hand in spreadsheets.

---

## Findings

### Part 1: Tech stack

#### 1.1 What already exists (audit of this folder)

| Area | Current state | Verdict |
|---|---|---|
| Front end | Vite 6, React 19, TS 5.8, Tailwind 4 (`@theme` tokens in [src/index.css](../../src/index.css)), lucide-react | Keep |
| Server | `express` 4 and `dotenv` installed, but no server file exists | Add a small Express 5 server |
| LLM | `@google/genai` installed but never imported | Use it on the server only |
| `motion` | Installed but not used anywhere in `src/` | Remove |
| Persistence | None. Everything is `useState`, so a refresh loses all data | Add SQLite |
| Scoring | [infrastructureLogic.ts](../../src/features/assessments/utils/infrastructureLogic.ts) is a good first engine (14 criteria, product-type weights, context multipliers, 3 exclusions) | Move it to `shared/`, type it, test it |
| Git | Not a repository | `git init` and push to a group GitHub repo on day one |

#### 1.2 Recommended stack

| Layer | Choice | Why this and not something bigger |
|---|---|---|
| Runtime | **Node 24 LTS (≥ 24.15)** | v20 reached EOL on 2026-03-24, and v24 is LTS [Node releases]. 24.15 is the version where `node:sqlite` became a release candidate [Node v24 sqlite docs]. Pinecone's SDK needs Node ≥ 22 and Vitest needs ≥ 22.12. |
| UI | **React 19 + Vite + TypeScript** | Already in place and the whole group knows it. No Next.js, because we need no SSR, SEO or file routing. |
| Styling | **Tailwind CSS 4** with tokens in `@theme` | Already in place. `@theme` variables automatically generate `bg-*`, `text-*` and similar classes [Tailwind theme docs]. |
| Routing | **None at first** (the current tab/step state) | Add `react-router` only if we need shareable URLs later. |
| API server | **Express 5** (one file, a few routers) | Express 5 automatically passes errors from `async` handlers to `next()` [Express error-handling docs], so no try/catch boilerplate is needed. It is already a dependency. |
| Validation + types | **Zod 4** | One schema gives TypeScript types, request validation, *and* the JSON schema for Gemini's structured output (`z.toJSONSchema`) [Zod JSON Schema docs]. |
| Database | **SQLite via `node:sqlite`** (built into Node, file `data/app.db`) | No DB server, no ORM, no native build step. We have maybe a few hundred assessments. The file can be opened with any SQLite viewer and exported to CSV for analysis. |
| LLM | **`@google/genai`**, model pinned in one constant (`gemini-3.8-flash`) | Current stable Flash model [Gemini models]. Pin the exact ID, not `gemini-flash-latest`, so reports can be reproduced for the thesis. |
| Embeddings | **Whatever the group's Pinecone index was built with** (`gemini-embedding-001` or `gemini-embedding-2`) | The query must use the same model *and* the same dimension as the documents. For `-001`, non-3072 dimensions "must" be normalised manually [Gemini embeddings]. |
| Vector DB | **`@pinecone-database/pinecone`** (v9) | Already the group decision. Use one namespace (or a `module` metadata filter) per component [Pinecone indexing overview]. |
| Tests | **Vitest** | Reuses `vite.config.ts` with zero configuration [Vitest guide]. We only really need tests for the engine. |
| Formatting | **Prettier + `tsc --noEmit`** | No ESLint rule debates. `npm run check` = typecheck + tests + format check. |
| Dev runner | `concurrently` running `vite` + `tsx watch server/index.ts`, with Vite `server.proxy` `'/api' → 'http://localhost:3001'` [Vite server options] | One command (`npm run dev`) and one port in the browser. |

**Deliberately *not* used, and why:** no ORM (Prisma/Drizzle), because a few hand-written SQL lines are easier to read. No Redux/Zustand, because state is small and local. No Docker for development. No LangChain, because RAG here is embed → query → paste into prompt, about 30 lines. No auth framework yet (see open questions). No component library, because the prototype already has its own look.

#### 1.3 Architecture in one picture

```
Browser (React)                         Server (Express, holds all keys)
─────────────────                       ─────────────────────────────────
Company form ─────────┐                 POST /api/companies
Infra: context step   │   fetch /api    POST /api/assessments/infrastructure
Infra: questions      ├───────────────▶   └─ shared/infrastructure/engine.ts  ← pure, deterministic, <3 s
Infra: results        │                 POST /api/assessments/:id/report
Dashboard            ─┘                   ├─ rag.ts   → Gemini embed → Pinecone query
                                          └─ gemini.ts → Gemini text (JSON) → zod check → fallback
shared/ (imported by BOTH sides)         SQLite: data/app.db
  types, company enums, engine, config   data/reference/*.json (TRCSL, DCs, hardware)
```

The engine lives in `shared/`, so the browser can show a live preview while the user answers. The **server re-runs the same function** when saving, and its result is the one that gets stored. The engine never imports anything from `server/llm`, which enforces "no LLM in the scoring path" in the code structure itself.

---

### Part 2: Project standards

#### 2.1 Folder structure (one folder per module = one owner per folder)

```
smart/
├─ src/                              # React app
│  ├─ components/ui/                 # Button, Card, NumberField, ChoiceField, ScoreBar, Stepper …
│  ├─ layout/                        # Sidebar, Tabs, … (existing)
│  ├─ lib/api.ts                     # tiny fetch wrapper: api.get / api.post
│  └─ features/
│     ├─ company/                    # shared company (everyone depends on this)
│     ├─ dashboard/                  # combines the 4 ModuleResults
│     ├─ infrastructure/             # ← you
│     │  ├─ InfrastructurePage.tsx   # step switcher only
│     │  ├─ ContextStep.tsx  NeedsStep.tsx  QuestionsStep.tsx  ResultsStep.tsx
│     ├─ marketing/  compliance/  product/
├─ shared/                           # pure TS, no React, no Node APIs
│  ├─ company.ts                     # ONE set of enums for stage, productType, operatingMode …
│  ├─ moduleResult.ts                # contract every module returns to the dashboard
│  └─ infrastructure/
│     ├─ criteria.ts   weights.ts   rules.ts   questions.ts   # DATA — editable by researchers
│     ├─ engine.ts     plan.ts                                # LOGIC — pure functions
│     ├─ engine.test.ts plan.test.ts
│     └─ scenarios/*.json                                     # expert test scenarios (golden cases)
├─ server/
│  ├─ index.ts   db.ts
│  ├─ routes/companies.ts  routes/assessments.ts
│  └─ llm/gemini.ts  llm/rag.ts  llm/prompts/infrastructure.ts
├─ data/
│  ├─ reference/trcsl-tariffs.json  data-centres.json  hardware-prices.json
│  └─ app.db                         # gitignored
├─ scripts/  ingest-kb.ts  run-scenarios.ts  evaluate.ts  export-csv.ts
└─ docs/  research/  decisions/      # one short markdown file per decision
```

#### 2.2 Core concepts (the five rules everyone follows)

1. **Rules are data.** Every weight, multiplier, exclusion, threshold and question lives in a data file, and each entry has a `why` (with a citation or "AHP round 2", say). Changing a weight must never require touching `engine.ts`.
   ```ts
   // shared/infrastructure/rules.ts
   export const MULTIPLIERS: Multiplier[] = [
     { criteria: ['connectivity', 'power', 'backup_recovery'], when: (c) => c.urbanRural === 'rural',
       factor: 1.3, why: 'Rural grid/ISP reliability — interview theme T4; Nagahawatte & Wijayanayake 2025' },
   ];
   ```
2. **The engine is a pure function.** `assess(company, context, answers, config) → InfraResult`. It does no `fetch`, no `Date.now()`, no randomness and no LLM calls. Same input gives the same output, which is what κ/MAE need.
3. **Every stored result is reproducible.** Save `inputs`, `result`, `engineVersion` (bump it when weights or rules change) and, for reports, `model` + `promptVersion`.
4. **The LLM only writes prose.** Scores, gaps, priorities and costs shown on screen always come from the engine result, never from LLM text. If Gemini fails or returns invalid JSON, the page shows the deterministic template text (the prototype's `buildScalabilityNarrative` already does this).
5. **Reference data carries its source.** Every price or spec has `{ value, unit, source, sourceUrl, retrievedOn, peerReviewed }`. This directly answers the methodology rule that "non-peer-reviewed sources are used only for context and pricing, and are labelled as such."

#### 2.3 Coding standards (short on purpose)

- **TypeScript `strict: true`.** No `any` in `shared/`. Use `unknown` + zod at the edges.
- **One shared company.** Stage, product type, operating mode and similar fields come from `shared/company.ts`. Modules *read* the company and ask only for module-specific extras. They never re-ask company fields with different option values.
- **Components stay small**, around 200 lines at most, with one step per file. Repeated input markup goes into `components/ui` (the prototype copies `NumInput`/`TextInput`/`Section` into each module).
- **Money is in LKR integers, and dates are ISO strings.** Criterion IDs are `snake_case` (as they already are).
- **Server routes are thin:** validate with zod → call the engine or DB → return JSON. Errors come back as `{ error: string }` with a proper status.
- **Secrets live only in `.env` on the server.** Never use a `VITE_` prefix for a key (Vite puts those in the browser bundle) [Vite env docs].
- **Privacy:** no company name or personal data goes into a Gemini prompt. Send IDs, enums and scores only. On the unpaid tier, Google may use prompts and responses to improve its products, and human reviewers may read them [Gemini API terms].
- **Comments:** explain *why* in data files, since the rationale is research evidence. Keep code comments minimal.

#### 2.4 Styling standards

- **Tailwind utilities only.** No new `.css` files. Colours, radii and fonts are **tokens in `@theme`** in `src/index.css`.
- **No hex values in class names.** Replace the 16 `bg-[#…]`/`text-[#…]` uses with tokens (for example, add `--color-sky-200: #BAE6FD` and use `bg-sky-200`).
- Use a small fixed type scale (for example, page title `text-2xl font-bold`, section `text-lg font-bold`, body `text-[15px]`, help `text-sm text-neutral-500`). Agree on it once and put it in the UI primitives.
- **Colour meaning is shared across modules**, so the dashboard looks like one product. Use the same three readiness bands and colours for everyone (for example, 0–49 *Not ready*, 50–74 *Partially ready*, 75–100 *Ready*). Doing this also gives κ its categories (see 3.7).
- The layout must work down to phone width, and the stepper/question pages must be usable on a laptop screen for the SUS sessions.
- Fix leftovers: [index.html](../../index.html) still says "nexaura - Private Pension & Insurance".

#### 2.5 Team workflow

- GitHub repo, protected `main`, short-lived branches `yourname/feature`, **one teammate review per PR**, and `npm run check` must pass.
- A change to `weights.ts`/`rules.ts` must update the golden scenarios in the same PR, so that any score change is intentional and visible in review.
- Add a `README.md` with setup steps (Node version, `.env` keys, `npm run dev`) and a one-page `CONTRIBUTING.md` holding these rules.

---

### Part 3: Infrastructure module end to end

#### 3.1 The pipeline mapped to code

| Methodology stage | Code | Output |
|---|---|---|
| 1. Company Context | `company` (shared) + `ContextStep` (infra extras: operating mode, users now/launch/1yr, traffic, budgets, province, urban/rural, current internet/hosting/hardware/power, growth, deployment preference) | `InfraContext` |
| 2. Determine Infrastructure Needs | `engine.applicability()` + `engine.weights()` | 14 criteria → applicable set + final weights, each with reasons |
| 3. Show Relevant Questions | `questions.ts` filtered by applicable criteria and `showIf(ctx)` | 2–4 concrete questions per criterion |
| 4. Calculate Readiness | `engine.score()` | criterion scores (0–5), physical/digital/overall (0–100), gaps, priority order |
| 5. Scalability Plan (N4) | `plan.ts` (rules + reference data) → `gemini.ts` (prose) | plan items (deterministic) → descriptive prose (LLM) |

#### 3.2 Turn self-ratings into specific questions (the most important change)

The prototype asks "rate Power 0–5". The research goal is to *dive into specific questions*, so each criterion should instead get a few objective questions, with each answer option mapped to points:

```ts
// shared/infrastructure/questions.ts
{ id: 'power_backup_runtime', criterion: 'power',
  text: 'How long can your critical equipment run during a power cut?',
  options: [
    { label: 'No backup', points: 0 },
    { label: 'UPS < 15 min', points: 2 },
    { label: 'UPS ≥ 30 min', points: 3 },
    { label: 'UPS + generator / solar-battery', points: 5 },
  ],
  showIf: (c) => c.operatingMode !== 'remote',
  why: 'CEB outage context; expert interview theme T2' },
```

The criterion score is the average of its answered question points, giving 0–5. This is more objective than self-rating, easier for experts to validate (content validity), and the UI becomes **one generic `QuestionsStep` that renders whatever is in the data file**. Adding a question is then a data edit, not a UI change.

#### 3.3 Scoring (N1): keep the prototype maths, make it explicit

- `finalWeight = baseWeight[productType][criterion] × Π(multipliers that fire)`. Excluded criteria get 0. Weights are then normalised to 100%.
- `overall = Σ weightPct × score/5` gives 0–100. **This settles open item 4: 0–100 is what the mechanism actually produces.**
- Gap: `score ≤ 2`. **Priority = points lost = weightPct × (5 − score)/5** (the prototype sorts by weight only, so a 2/5 on a heavy criterion and a 0/5 on a light one rank wrongly).
- `weights.ts` should be able to hold weights from **either** AHP **or** literature (open item 2). If AHP is chosen, `scripts/ahp.ts` (about 40 lines: geometric-mean method + consistency ratio) turns the experts' pairwise matrices into the weights file, and the consistency ratio is recorded in the `why`.

#### 3.4 Scalability plan (N4): deterministic items, then prose

1. **Growth tier** from `usersYear1 / usersNow` (the prototype already has four tiers), plus stage and deployment preference.
2. **Plan item rules** (data): for example, *if* tier ≥ High *and* hosting = shared → "Move to VPS/cloud with autoscaling". *If* rural *and* connectivity gap → "Add a second ISP (fibre + 4G/5G failover)". Each item has `{ criterion, horizon: 'now' | '0-6m' | '6-12m', action, why }`.
3. **Costing from reference data:** attach LKR ranges from `trcsl-tariffs.json` (connectivity), `data-centres.json` (Dialog Malabe Tier III, SLT Pitipana, as local hosting/colocation options; note that no hyperscaler has a Sri Lankan region, so latency and data-residency notes apply), and `hardware-prices.json`. Show the source and date next to every number.
4. **Budget check:** compare the summed monthly and one-off costs with the budgets from the context, and flag items that go over budget.
5. **Prose:** send the structured plan to Gemini, which writes the descriptive plan the methodology asks for. Experts rate agreement on the **structured items** (the ≥80% "prioritised initiatives" metric), so the LLM wording does not affect that metric.

#### 3.5 RAG + Gemini report

- `scripts/ingest-kb.ts` (run by hand): chunk the group's source documents → embed with the group's embedding model → upsert to Pinecone with metadata `{ module: 'infrastructure', source, page }`. If the group already ingests shared documents, only the query side is needed here.
- `server/llm/rag.ts`: build a query from the top 3 gaps + plan items → embed → Pinecone `query({ topK: 5, includeMetadata: true, filter: { module: 'infrastructure' } })`.
- `server/llm/gemini.ts`: call `ai.interactions.create` with model `gemini-3.8-flash`, a system instruction from `prompts/infrastructure.ts`, input = engine result JSON + retrieved chunks, and `response_format` = JSON schema generated from the zod `InfraReport` schema [Gemini structured output; Interactions docs]. Then validate with zod. On any failure, fall back to template text.
- **Cache** the report in SQLite together with `model` + `promptVersion`. Generate it on a separate request (`POST /api/assessments/:id/report`), so the **< 3 s response-time metric is measured on the scoring call**, not on the LLM call.
- Check the exact Interactions request field names against the SDK version installed when implementing. The docs examples use `response_format: { type, mime_type, schema }`, and they show no `generateContent` equivalent on the current structured-output page.

#### 3.6 Data model (SQLite, 3 tables, JSON columns)

```sql
CREATE TABLE companies   (id TEXT PRIMARY KEY, details_json TEXT NOT NULL, created_at TEXT NOT NULL) STRICT;
CREATE TABLE assessments (id TEXT PRIMARY KEY, company_id TEXT NOT NULL, module TEXT NOT NULL,
                          inputs_json TEXT NOT NULL, result_json TEXT NOT NULL,
                          engine_version TEXT NOT NULL, created_at TEXT NOT NULL) STRICT;
CREATE TABLE reports     (assessment_id TEXT PRIMARY KEY, report_json TEXT NOT NULL,
                          model TEXT NOT NULL, prompt_version TEXT NOT NULL, created_at TEXT NOT NULL) STRICT;
```

Every module uses the same tables, and the `module` column separates them. Module-specific shapes live in the JSON and are checked by that module's zod schema, so no migrations are needed when a teammate changes their questions.

#### 3.7 Evaluation tooling (built into the repo, not spreadsheets)

- `shared/infrastructure/scenarios/*.json`: the same company scenarios the experts assess, run by Vitest as golden tests.
- `scripts/run-scenarios.ts` → `system_scores.csv`. `scripts/evaluate.ts` then takes `expert_scores.csv` and computes **MAE** (0–100), **Cohen's/Fleiss' κ** and raw agreement.
- **κ needs categories, but the score is continuous.** Decide *before* data collection which categorical judgement is compared. The recommendation is readiness band (Not / Partially / Ready) and, per criterion, gap yes/no. Both come straight out of the engine.
- `scripts/export-csv.ts` dumps all assessments for descriptive statistics.
- The server logs how long each `/assessments` call takes, which gives the response-time metric. SUS can stay a Google Form.

#### 3.8 Build order (≈ 2-week iterations, matching the Agile approach in 3.6 of the methodology)

| # | Iteration | Done when |
|---|---|---|
| 0 | **Foundation.** Git init, Node 24.15+, strict TS, Prettier, Vitest, folder restructure, `shared/company.ts` enums, Express 5 + SQLite skeleton, Vite proxy, README | `npm run dev` runs both halves, and `npm run check` is green |
| 1 | **N1 engine.** Move criteria/weights/rules into `shared/infrastructure` with `why` fields, pure `assess()`, points-lost priority, 5+ golden scenarios | Tests pass, and changing a weight changes only data + snapshots |
| 2 | **Questions.** `questions.ts` for all 14 criteria + generic `QuestionsStep`, and the context step reads the saved company | Criterion scores come from answers, and no company field is asked twice |
| 3 | **Persistence + dashboard contract.** Company and assessment API, `ModuleResult`, cards show real status/score | A refresh keeps data, and the dashboard shows the infra score |
| 4 | **N4 plan.** Plan rules, the three reference-data JSON files with sources, budget check, results page | The plan lists items with horizon, cost range and source |
| 5 | **RAG + Gemini report.** Ingest/query, prompt, zod-validated JSON, fallback, cache | The report renders, and turning off the API key still gives a template report |
| 6 | **Evaluation tooling.** Scenario runner, `evaluate.ts` (MAE, κ), CSV export, timing log | One command prints MAE/κ against a sample expert CSV |
| 7 | **Content validity loop + deploy.** Apply the expert panel's edits (data-only), redeploy for SUS/usability sessions | Experts' revisions are merged, and the app is reachable by test users |

Iterations 0 and 3 touch shared code (`company.ts`, `moduleResult.ts`, the dashboard), so **agree on them with the other three members first**. Everything else is inside the infrastructure folders.

---

## Open questions / limitations

- **Hosting.** Cloud Run (where AI Studio deploys) has an **in-memory filesystem that "doesn't persist when the instance stops"** [Cloud Run container contract], so a SQLite file would be lost there. Pick a host with a persistent disk (a small VM or any Node host with a volume) *or*, if the group insists on Cloud Run, swap `db.ts` for Firestore. Only `server/db.ts` would change. Specific host pricing was not researched.
- **Embedding model and dimension of the group's Pinecone index.** Confirm with whoever owns the shared knowledge base. `gemini-embedding-2` is now the latest model, and `-001` stays for text-only use [Gemini embeddings]. Query and documents must match.
- **Paid vs free Gemini tier.** The free tier allows Google to use and human-review prompts [Gemini API terms]. Anonymising inputs covers the ethics requirement either way, but the supervisor should know.
- **Auth.** Not researched. For a study with 30–50 respondents, a simple shared access code may be enough. Decide with the group.
- **`node:sqlite` is a release candidate (stability 1.2), not stable.** If anyone hits an API change, `better-sqlite3` (v13, mature) has an almost identical synchronous API.
- **Gemini docs changed quickly in 2026** (Interactions API GA in June 2026). Recheck model IDs and request fields when implementing iteration 5.
- **TRCSL tariff PDFs, data-centre details and retailer prices were not fetched here.** They are research data the module owner collects, and they should be stored in `data/reference/` with dates.
- The methodology's open items 1 (n = 6 survey), 3 (mention Gemini/RAG in Section 3; the architecture above gives the wording: "the LLM receives the finished engine result and cannot change scores") and 5 (references) are writing tasks, not technical ones.

## Sources

- Project folder audit: [package.json](../../package.json), [src/features/assessments/utils/infrastructureLogic.ts](../../src/features/assessments/utils/infrastructureLogic.ts), [src/features/assessments/components/InfrastructureAssessment.tsx](../../src/features/assessments/components/InfrastructureAssessment.tsx), [src/features/businessProfile/components/CompanyProfileForm.tsx](../../src/features/businessProfile/components/CompanyProfileForm.tsx): primary (the code itself)
- [Gemini models](https://ai.google.dev/gemini-api/docs/models): official model list; `gemini-3.8-flash` stable, 2.0 shut down, 2.5 restricted for new projects
- [Gemini Interactions API](https://ai.google.dev/gemini-api/docs/interactions): official; GA June 2026, `generateContent` legacy but supported
- [Gemini structured output](https://ai.google.dev/gemini-api/docs/structured-output): official; `response_format` with JSON schema, Zod supported
- [Gemini embeddings](https://ai.google.dev/gemini-api/docs/embeddings): official; model IDs, 128–3072 dims, normalisation rule, task types
- [Gemini API terms](https://ai.google.dev/gemini-api/terms): official; unpaid vs paid data use
- [googleapis/js-genai README](https://github.com/googleapis/js-genai) and `npm view @google/genai` (v2.24.0): first-party SDK; client-side key warning, `ai.interactions.create`
- [Pinecone TS client](https://github.com/pinecone-io/pinecone-ts-client) and [Pinecone indexing overview](https://docs.pinecone.io/guides/index-data/indexing-overview): first-party; Node ≥ 22, upsert/query API, namespaces, metadata filters
- [Vite env and mode](https://vite.dev/guide/env-and-mode) and [Vite server options](https://vite.dev/config/server-options): official; `VITE_` exposure warning, `server.proxy`
- [Express error handling](https://expressjs.com/en/guide/error-handling.html): official; Express 5 async error forwarding
- [Node `node:sqlite` (v24)](https://nodejs.org/docs/latest-v24.x/api/sqlite.html) and [Node releases](https://nodejs.org/en/about/previous-releases): official; RC since v24.15.0, v20 EOL
- [Cloud Run container contract](https://docs.cloud.google.com/run/docs/container-contract): official; ephemeral in-memory filesystem
- [Tailwind theme variables](https://tailwindcss.com/docs/theme): official; `@theme` → utilities
- [Vitest guide](https://vitest.dev/guide/): official; requirements, reuses Vite config
- [Zod JSON Schema](https://zod.dev/json-schema): official; `z.toJSONSchema`
- npm registry (`npm view`, 2026-09-28): latest versions: vite 8.3.1, express 5.2.1, zod 4.6.5, vitest 5.0.2, @pinecone-database/pinecone 9.0.0, better-sqlite3 13.0.3, react 19.3.0, tailwindcss 4.3.3
