# Smart

Launch-readiness assessment for startups. A founder describes their company once, then four modules (Infrastructure, Marketing, Compliance, Product) score how ready it is and suggest a plan.

**Read [CONVENTIONS.md](CONVENTIONS.md) before writing code.** Research and plans are in [docs/](docs/).

## Setup

1. Install Node 24 (see `.nvmrc`).
2. `npm install`
3. `cp .env.example .env.local` and fill in the values (see the comments in the file).
4. `npm run dev`, then open http://localhost:3000

## Scripts

| Command          | What it does                                                          |
| ---------------- | --------------------------------------------------------------------- |
| `npm run dev`    | Start the app locally                                                 |
| `npm run check`  | Typecheck + lint + formatting check. Must pass before a PR is merged. |
| `npm run format` | Fix formatting                                                        |
| `npm run build`  | Production build                                                      |

## Stack

Next.js 16 (App Router) · Tailwind CSS 4 · shadcn/ui (Radix) · Prisma 7.10 + Prisma Postgres · Better Auth · React Hook Form + Zod · Vercel
