# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary: technical startup founders in Sri Lanka.** Mostly developer-founders who know their own stack, at any stage from idea to scaling. They come to check how ready their company is to launch and what to fix first. The questions can use technical terms (hosting, uptime, data residency) without explaining every one.

**Admin:** one admin level (set with `npm run make-admin`) who uploads knowledge documents that the modules draw on.

**Evaluators:** a panel of domain experts who score the same company scenarios as the app, and test users in SUS usability sessions. They aren't the everyday users, but the product has to pass their evaluation.

## Product Purpose

Smart is a launch-readiness assessment for startups. A founder describes their company once, then four modules (Infrastructure, Marketing, Compliance, Product) score how ready it is, point out the weak spots and suggest a plan.

It is a group 4th-year research project with four members, one module each. **Right now, success means passing the research evaluation:**

- expert agreement with the app's scores (Cohen's/Fleiss' κ, MAE)
- ≥80% expert agreement on the prioritised plan items
- usability measured by SUS
- responses under 3 seconds

Real-world founder adoption comes after that and is a bonus, not the goal.

## Positioning

The scores are deterministic and can be traced back to their source. Criteria, weights, questions and thresholds are plain data files, and each entry records where it came from (literature, expert interviews, AHP). A pure engine turns answers into scores, and the same input always gives the same score. An LLM (Gemini) only writes explanation text afterwards and can never change a score. The reference data is Sri Lankan: TRCSL tariffs, local data centres, CEB power context, Sri Lankan legal steps, and costs in LKR.

## Operating Context

- Founders fill in the company profile once (stage, product type, operating mode, geographic focus), then work through each module's questions and read the score and plan.
- A founder can have several companies, each with its own four assessments.
- Assessments are either draft or completed.
- The SUS sessions run on laptops, and every screen also has to work at phone width.
- Expert validation keeps changing the weights and questions, so they are edited as data, not as UI.

## Capabilities and Constraints

- **Built:** sign up, log in and log out; founder and admin roles; companies CRUD; the company page with four module cards, all "Not started" for now.
- **Planned:** deploy (Phase 5), admin document upload at `/admin/documents` (Phase 6), the start of each module (Phase 7), then each module's questions, scoring engine, plan and Gemini report with a RAG knowledge base.
- **Stack** (see `docs/research/`): Next.js 16, Tailwind 4, shadcn/ui (Radix), Prisma 7.10 + Prisma Postgres (Singapore), Better Auth, Vercel `sin1`.
- **Privacy:** no company name or personal data is ever sent to an AI API. Only IDs, enums and scores go.
- If Gemini fails, the report falls back to template text. Every score, gap, priority and cost on screen comes from the engine, not from LLM text.
- Money is stored as integer LKR. Every reference number shows its source and date.
- **Terms we always use:** company, assessment, module, criterion/criteria, score, draft/completed, document, founder, admin.
- Four teammates edit the code, so the UI is built from the shared components in `components/shared/` (see `CONVENTIONS.md`).

## Brand Commitments

- **Name:** "Smart" is the working name and may change to **"Nexaura"**. Keep the name easy to swap (it lives in `components/shared/app-logo.tsx` and the page titles).
- **Visual identity:** not decided yet. The user asked for a branding proposal built on the current base. The palette from the `../smart/` prototype (neutral, lilac, lime, blue, yellow in `globals.css`) and the Arimo font are a starting point, not a commitment.
- **Voice:** plain and direct, written for technical readers.

## Evidence on Hand

- Research and methodology: `docs/research/2026-09-28-tech-stack-and-infrastructure-plan.md` and `docs/research/2026-09-28-nextjs-stack-and-conventions.md`.
- The prototype in `../smart/` (read-only) has the infrastructure logic and UI ideas.
- **Not available yet:** expert scores, SUS results, real founder testimonials, any users or customers. Don't invent stats, testimonials, partner logos or adoption claims.

## Product Principles

1. **Every score can be traced.** A founder or an expert can always see why a score is what it is and where the rule came from.
2. **The engine decides and the LLM explains.** The wording never stands in for the logic.
3. **Local truth beats generic advice.** Sri Lankan costs, rules and infrastructure facts, with sources and dates.
4. **Plain enough for any teammate to change.** Research outputs change during validation, so the code and screens stay simple and consistent.
5. **Respect the founder's data.** Company details stay out of third-party AI prompts.

## Accessibility & Inclusion

- Every screen works down to phone width, and touch targets are at least 44px.
- The question flows are comfortable on a laptop for the SUS sessions.
- No formal WCAG level has been set yet. This is still open.
