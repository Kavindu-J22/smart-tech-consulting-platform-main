# Starting your module

Each of us builds one module (infrastructure, marketing, compliance, product) in its own folder. `infrastructure/` is the starting point: one page with an empty state.

To start yours (example: `marketing`):

1. Make a branch: `yourname/marketing-start`.
2. Copy `features/infrastructure/` to `features/marketing/`. Rename the file to `marketing-start.tsx` and the component to `MarketingStart`, and change the text and icon.
3. Copy `app/(app)/companies/[companyId]/infrastructure/` to `app/(app)/companies/[companyId]/marketing/`. Change the title, the page name and the import.
4. Add `"marketing"` to `MODULES_WITH_PAGE` in `features/company/components/module-cards.tsx`, so its card on the company page becomes a link.
5. Run `npm run check`, then open a PR with a desktop and a phone screenshot.

When you need more than a page, add these files to your folder, copying their shape from `features/company/`:

- `options.ts` for choice lists
- `schema.ts` for form rules
- `data.ts` for database work. Every function starts with `requireCompany(companyId)`.
- `actions.ts` for what forms call
- `config/` and `engine/` for your criteria, weights and score calculations, which never touch the database

Read `CONVENTIONS.md` before you start. Your module may import only from its own folder, `@/features/company/options` and `@/features/company/schema`; ESLint checks this.
