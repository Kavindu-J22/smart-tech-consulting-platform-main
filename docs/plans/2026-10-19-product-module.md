# Plan: Product module (Smart Product Validation System)

**Date**: 2026-10-19
**Owner**: Amashi
**Based on**: the Figma Make prototype `nMYK4PxHEQWczu42C6ndvG` and [research/2026-09-28-nextjs-stack-and-conventions.md](../research/2026-09-28-nextjs-stack-and-conventions.md)

## Status

| # | Phase | Status |
|---|---|---|
| 1 | Module start page | ✅ done |
| 2 | Upload the RAG data | ✅ done (9 vectors in namespace `product`) |
| 3 | Database table | ✅ done (migration applied 2026-10-20) |
| 4 | Questions and rules | ✅ done |
| 5 | Stage selection | ✅ done |
| 6 | Questionnaire and review | |
| 7 | Generate the report (RAG and OpenAI) | |
| 8 | Report pages and finishing | |

## Context

You're building the **Product** module, one of the four assessment modules on the company page. A founder:

1. picks the product's stage,
2. answers the questionnaire for that stage,
3. reviews the answers,
4. gets a validation report: a SWOT analysis, market blockers, a market research guide and prioritised recommendations.

The report is written by an OpenAI model, which uses similar scenarios found in Pinecone (RAG). The screens follow your Figma Make prototype (`nMYK4PxHEQWczu42C6ndvG`).

**Constraints**
- **Commits:** your university tracks your commits, so the work is split into **8 phases, one commit each**. You make every commit. I stop after each phase and suggest a commit message.
- **Your files only:** almost all work stays in your own files (`features/product/`, `app/…/product/`, one script). The few shared files I have to touch are listed below.
- **Your decisions:**
  - Upload all 9 scenarios to RAG. Your evaluation must then use *other* scenarios, not these 9.
  - Use OpenAI (changed from Gemini on 2026-10-19).  Embeddings: `text-embedding-3-large`, 3072 dimensions.
  - Use the shared database.
  - The npm packages are already agreed with the group.

## Shared files this touches (the only ones outside your module)

| File | Change | Why it can't be avoided |
|---|---|---|
| `prisma/schema.prisma` | New `ProductAssessment` model, plus **one line** in `Company` (`productAssessments ProductAssessment[]`) | Prisma requires a relation to be declared on both models |
| `prisma/migrations/<new>/` | One new migration folder | Created by Prisma |
| `features/company/components/module-cards.tsx` | Add `"product"` to `MODULES_WITH_PAGE` | Step 4 of `features/README.md` |
| `package.json`, `package-lock.json` | Add `@pinecone-database/pinecone@9.0.0` and `openai@7.28.0` | New dependencies |
| `.env.example` | Add `OPENAI_API_KEY=`, `PINECONE_API_KEY=` and `PINECONE_INDEX=` (keys only, no values) | Every env key is listed there |
| `components/shared/textarea-field.tsx`, `components/shared/checkbox-field.tsx` (new), `components/ui/textarea.tsx` and `checkbox.tsx` (added by shadcn), `eslint.config.mjs` (2 entries in `SHARED_ONLY`) | Fields for long answers and multi-select | `CONVENTIONS.md`: a missing field type goes in `components/shared/` |

These edits are all additions. No teammate's existing code changes.

## Database: the one new table (for your approval)

```prisma
// One Product assessment for a company. Answers and report are JSON because each of the
// three stages has a different questionnaire; features/product/schema.ts checks their shape.
model ProductAssessment {
  id        String   @id @default(cuid())
  companyId String
  company   Company  @relation(fields: [companyId], references: [id], onDelete: Cascade)
  stage     String   // proposed | development | failed  (features/product/options.ts)
  status    String   @default("draft") // draft | completed
  answers   Json     @default("{}")
  report    Json?    // SWOT, blockers, research guide, recommendations, sources. Null until generated
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([companyId])
}
```

**Applying it safely to the shared database:**
1. Tell the team beforehand.
2. Run `npx prisma migrate status` to confirm no other migrations are pending.
3. Run `npx prisma migrate dev --name add_product_assessment --create-only`. This only writes the SQL file, and I'll show it to you.
4. Run `npx prisma migrate deploy`. Unlike `migrate dev`, `deploy` never resets the database.
5. Restart `npm run dev`.

## Pinecone: what gets uploaded

- **Index:** `smart-tech-consulting-platform` (3072 dimensions, cosine), **namespace `product`**.
- **One vector per scenario (9 in total)**, with the id set to `scenario_id` (for example `SIM-004`).
- **What gets embedded:** only the **questionnaire inputs** (concept, audience, competitors, value proposition, challenges), so a founder's answers find similar products. The **outputs** (SWOT, blockers, research guide) are stored in metadata and handed to the report model as worked examples.
- **Embedding model:** OpenAI `text-embedding-3-large`, 3072 dimensions (its full size, matching the index). No prompt prefixes are needed.
- **The data file:** `Product and Service Managemnet.json` moves to `scripts/data/product-scenarios.json`. The current name has spaces and a typo, and the file belongs next to the script that reads it.
- **Re-running the upload:** upserting by `scenario_id` means a second run overwrites the vectors instead of duplicating them.

## Folder layout (all new)

```
src/features/product/
├─ options.ts             PRODUCT_STAGES + labels/descriptions/tags, choice lists for questions, statuses
├─ schema.ts              zod: answers per stage, ReportSchema (+ types)
├─ data.ts                list/get/create/update/delete ProductAssessment; each starts with requireCompany
├─ actions.ts             createProductAssessmentAction, saveProductAnswersAction,
│                         generateProductReportAction, deleteProductAssessmentAction
├─ report.ts              server-only: embed answers → Pinecone query (ns "product", top 3) → OpenAI → zod check
├─ config/questions.ts    the 3 questionnaires (sections, questions, field type), copied from the prototype
├─ config/rag.ts          model names, 3072, namespace "product", TOP_K. Constants only
└─ components/            product-start, stage-picker, questionnaire-form, review-answers,
                          analysis-progress, swot-grid, blocker-list, research-guide, recommendation-list …
src/app/(app)/companies/[companyId]/product/
├─ page.tsx                                   assessments list / empty state
├─ new/page.tsx                               stage selection
└─ [assessmentId]/page.tsx, review/, report/, report/details/
scripts/upload-product-knowledge.ts           run with: npx tsx scripts/upload-product-knowledge.ts
scripts/data/product-scenarios.json
docs/plans/2026-10-19-product-module.md        a copy of this plan with a status table
```

**Privacy:** OpenAI receives only the answers and the stage. It never gets the company name or user data, as `CONVENTIONS.md` requires.

**Look:** the screens keep the prototype's layout, questions and wording but use the app's shared components and theme colours. The prototype's indigo, amber and red become the brand palette: lilac, yellow, and the existing destructive colour.

## The 8 phases (one commit each)

| # | Phase | Main files | Suggested commit |
|---|---|---|---|
| 1 | **Module start page.** The card becomes a link, and the page shows an empty state. Also adds the plan doc. | `features/product/components/product-start.tsx`, `app/…/product/page.tsx`, `module-cards.tsx`, `docs/plans/…` | `feat: add product module start page` |
| 2 | **Upload the RAG data.** Packages, env keys, `config/rag.ts`, the upload script and the moved JSON. Uses OPENAI_API_KEY and the Pinecone keys. | `scripts/upload-product-knowledge.ts`, `scripts/data/…`, `config/rag.ts`, `package.json`, `.env.example` | `feat: upload product scenarios to pinecone` |
| 3 | **Database table.** `ProductAssessment` and the migration, applied with the safe steps above. | `prisma/schema.prisma`, `prisma/migrations/…` | `feat: add product assessment table` |
| 4 | **Questions and rules.** Options, the 3 questionnaires in `config/questions.ts`, zod schemas, and the two new shared fields. | `options.ts`, `config/questions.ts`, `schema.ts`, `components/shared/*-field.tsx` | `feat: add product questionnaire config and schemas` |
| 5 | **Stage selection.** Choosing a stage creates a draft, and the list page shows your assessments. | `data.ts`, `actions.ts`, `stage-picker.tsx`, `product/new/page.tsx` | `feat: add product stage selection` |
| 6 | **Questionnaire and review.** Sections with a progress bar, each section saves the draft, then a review page with "Edit" links. | `questionnaire-form.tsx`, `review-answers.tsx`, `[assessmentId]/page.tsx`, `review/page.tsx` | `feat: add product questionnaire and review` |
| 7 | **Generate the report (RAG and OpenAI).** `report.ts` and the analysis progress screen. Saves the report and marks the assessment completed. If OpenAI or Pinecone fails, a readable toast lets you try again. | `report.ts`, `analysis-progress.tsx`, `actions.ts` | `feat: generate product validation report with rag` |
| 8 | **Report pages and finishing.** Summary and detailed report, which scenarios were used (sources), delete with `ConfirmDialog`, the phone layout, and the plan status updated. | `report/page.tsx`, `report/details/page.tsx`, `swot-grid.tsx` … | `feat: add product report pages` |

Every phase ends with `npm run check` passing and a check in the browser. **I don't commit.** After each phase I stop, show you what changed (`git status`), and give you the commit message.

## Verification

- **Phase 2:**
  - `describe_index_stats` shows **9 vectors in namespace `product`**, and other namespaces are untouched.
  - A test query such as "AI tool for clinics" returns the matching health scenarios (SIM-005 and SIM-018) as top hits.
- **Phase 3:**
  - `npx prisma migrate status` reports the schema as up to date.
  - The table is visible in Prisma Studio.
- **Phases 5–6:**
  - You can create a draft, leave, come back, and find your answers still there.
  - Another user's assessment id returns 404.
- **Phase 7:**
  - Generating a report for a sample founder stores a report that passes `ReportSchema`.
  - The report lists the scenario ids it drew on.
  - A wrong `OPENAI_API_KEY` shows a toast, not a crash.
- **Every phase:**
  - `npm run check` passes.
  - Desktop and phone screenshots match the screens next to them.

## Not in this plan

- **"Completed" on the company page card.** The card lives in the `company` feature, and a feature may not import another feature's data. That needs a group decision.
- **Automated evaluation** (comparing generated SWOTs against ground truth). That's a separate step for your thesis, and it uses scenarios other than these 9.
