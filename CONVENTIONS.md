# Conventions: folders, naming and code style

Everyone follows this file. If something isn't covered here, copy what `features/company` does. If that doesn't answer it, ask in the group and add the answer here.

**The rule behind all the others:** a teammate who has never seen a file should understand it in 10 seconds. When in doubt, write the plain, obvious version.

## 1. Folder structure

```
smart-app/
├─ docs/                        # research, plans, decisions
├─ prisma/
│  ├─ schema.prisma             # all database tables
│  └─ migrations/               # generated, never edit by hand
├─ scripts/                     # make-admin.ts, db-backup.sh
├─ prisma.config.ts
├─ vercel.json                  # { "regions": ["sin1"] }
├─ .env.example                 # every env key, no values
├─ CONVENTIONS.md               # this file
└─ src/
   ├─ proxy.ts                  # sends logged-out users to /login
   ├─ app/                      # ROUTES ONLY
   │  ├─ (auth)/login/  (auth)/signup/
   │  ├─ (app)/companies/…      # founder pages
   │  ├─ (admin)/admin/…        # admin pages
   │  └─ api/                   # only: auth/[...all], documents/upload, documents/[documentId]
   ├─ components/
   │  ├─ ui/                    # shadcn files, never edit
   │  └─ shared/                # our own components: buttons, fields, dialogs, page header
   ├─ features/                 # ALL real code lives here
   │  ├─ auth/
   │  ├─ company/               # companies (the example every feature copies)
   │  ├─ knowledge/             # admin document uploads
   │  └─ infrastructure/  marketing/  compliance/  product/
   ├─ generated/                # Prisma client, git-ignored
   └─ lib/
      ├─ db.ts                  # the Prisma client
      ├─ auth.ts                # Better Auth (server)
      ├─ auth-client.ts         # Better Auth (browser)
      ├─ dal.ts                 # requireUser(), requireCompany(), requireAdmin()
      └─ utils.ts               # cn() from shadcn, nothing else
```

### Every feature has the same files

```
features/<name>/
├─ options.ts      # fixed choice lists: ids + labels
├─ schema.ts       # form rules (zod) + the types made from them
├─ data.ts         # the ONLY file that talks to the database
├─ actions.ts      # what forms call
├─ components/     # the forms and views
├─ config/         # modules only: criteria, weights, questions
└─ engine/         # modules only: score calculations
```

Leave out files you don't need, but **never invent a new kind of file**.

When you create a new feature folder, add its name to `FEATURES` in `eslint.config.mjs`, so the import rules cover it.

### Where do I put…?

| Thing                                                        | Goes in                                                   |
| ------------------------------------------------------------ | --------------------------------------------------------- |
| A new page / URL                                             | `app/…/page.tsx`, a few lines that call `features/`       |
| A list of choices (stages, product types)                    | `features/<name>/options.ts`                              |
| Form validation                                              | `features/<name>/schema.ts`                               |
| A database query                                             | `features/<name>/data.ts`                                 |
| Something a form submits to                                  | `features/<name>/actions.ts`                              |
| A component used by one feature                              | `features/<name>/components/`                             |
| A component used by two or more features                     | `components/shared/`                                      |
| A button, field, choice list, confirm dialog or page heading | the one in `components/shared/` (see "Shared components") |
| A shadcn component                                           | `npx shadcn@latest add <name>` → `components/ui/`         |
| A colour, font or radius                                     | `app/globals.css` only                                    |

### Import rules

- A feature never imports from another feature. **Exception:** everyone may import `@/features/company/options` and `@/features/company/schema`, because the company is shared. _(Checked by ESLint.)_
- Always import with `@/…`. Never use `../`. _(Checked by ESLint.)_ `./` for a file in the same folder is fine.
- Pages and features never import the shadcn parts that have a shared version (see "Shared components"). _(Checked by ESLint.)_
- Components never import `data.ts` or `lib/db.ts`. _(The `import "server-only"` line makes the build fail.)_
- `engine/` and `config/` never import anything that touches the database, the network or the clock.
- No `index.ts` files that re-export other files.

## 2. Naming

| What                 | Style                                                       | Example                                             |
| -------------------- | ----------------------------------------------------------- | --------------------------------------------------- |
| Files and folders    | kebab-case                                                  | `company-form.tsx`                                  |
| Components           | PascalCase, same as the file                                | `company-form.tsx` → `CompanyForm`                  |
| Functions, variables | camelCase                                                   | `getCompany`, `companyId`                           |
| Server actions       | verb + `Action`                                             | `createCompanyAction`                               |
| Data functions       | `list` / `get` / `create` / `update` / `delete` + noun      | `listCompanies`, `deleteDocument`                   |
| Zod schemas          | PascalCase + `Schema`                                       | `CompanySchema`                                     |
| Types                | made from the schema                                        | `type CompanyInput = z.infer<typeof CompanySchema>` |
| Choice lists         | UPPER_SNAKE_CASE                                            | `STAGES`, `STAGE_LABELS`                            |
| Stored ids           | lowercase snake_case                                        | `"prelaunch"`, `"peer_reviewed"`                    |
| Booleans             | `is` / `has` / `can`                                        | `isAdmin`                                           |
| URLs                 | kebab-case, plural                                          | `/companies/[companyId]/edit`                       |
| Route params         | camelCase + `Id`                                            | `[companyId]`                                       |
| Database models      | PascalCase, singular                                        | `Company`, `Document`                               |
| Database fields      | camelCase                                                   | `ownerId`, `createdAt`                              |
| Env variables        | UPPER_SNAKE_CASE                                            | `DATABASE_URL`                                      |
| Git branches         | `yourname/short-description`                                | `damruwan/company-form`                             |
| Commits              | `type: short description`, type = feat / fix / chore / docs | `feat: add company edit page`                       |

**Words we always use** (never synonyms): company, assessment, module, criterion/criteria, score, draft/completed, document, founder, admin.

## 3. CRUD: the pattern every feature copies

```
Form (browser) ──▶ actions.ts ──▶ data.ts ──▶ database
                   check input    check login + owner, then query

Page (server)  ──▶ data.ts ──▶ database ──▶ page shows the result
```

**`options.ts`** holds the choices. Each list is written in exactly one place.

```ts
export const STAGES = ["idea", "prelaunch", "launched"] as const;

export const STAGE_LABELS = {
  idea: "Idea",
  prelaunch: "Pre-launch",
  launched: "Launched",
};
```

**`schema.ts`** describes what valid input looks like.

```ts
import { z } from "zod";
import { STAGES } from "./options";

export const CompanySchema = z.object({
  name: z.string().trim().min(1, "Enter a company name"),
  stage: z.enum(STAGES),
});

export type CompanyInput = z.infer<typeof CompanySchema>;
```

**`data.ts`** does all the database work. Every function starts with a check.

```ts
import "server-only";
import { db } from "@/lib/db";
import { requireUser, requireCompany } from "@/lib/dal";
import type { CompanyInput } from "./schema";

export async function listCompanies() {
  const user = await requireUser();
  return db.company.findMany({ where: { ownerId: user.id }, orderBy: { createdAt: "desc" } });
}

export async function getCompany(companyId: string) {
  return requireCompany(companyId);
}

export async function createCompany(input: CompanyInput) {
  const user = await requireUser();
  return db.company.create({ data: { ...input, ownerId: user.id } });
}

export async function updateCompany(companyId: string, input: CompanyInput) {
  await requireCompany(companyId);
  await db.company.update({ where: { id: companyId }, data: input });
}

export async function deleteCompany(companyId: string) {
  await requireCompany(companyId);
  await db.company.delete({ where: { id: companyId } });
}
```

**`actions.ts`** always does four steps: check the input, call `data.ts`, refresh the layout, go to the next page. The refresh matters because the sidebar (in the layout) lists companies, and a redirect alone doesn't re-render layouts.

```ts
"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { CompanySchema, type CompanyInput } from "./schema";
import { createCompany, updateCompany, deleteCompany } from "./data";

export async function createCompanyAction(input: CompanyInput) {
  const company = await createCompany(CompanySchema.parse(input));
  revalidatePath("/", "layout");
  redirect(`/companies/${company.id}`);
}

export async function updateCompanyAction(companyId: string, input: CompanyInput) {
  await updateCompany(companyId, CompanySchema.parse(input));
  revalidatePath("/", "layout");
  redirect(`/companies/${companyId}`);
}

export async function deleteCompanyAction(companyId: string) {
  await deleteCompany(companyId);
  revalidatePath("/", "layout");
  redirect("/companies");
}
```

**`components/company-form.tsx`** is one form for both create and edit.

```tsx
"use client";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CompanySchema, type CompanyInput } from "@/features/company/schema";
import { createCompanyAction, updateCompanyAction } from "@/features/company/actions";

type Props = { companyId?: string; defaultValues?: CompanyInput };

export function CompanyForm({ companyId, defaultValues }: Props) {
  const form = useForm<CompanyInput>({ resolver: zodResolver(CompanySchema), defaultValues });
  const [pending, startTransition] = useTransition();

  const onSubmit = form.handleSubmit((values) =>
    startTransition(async () => {
      const result = companyId
        ? await updateCompanyAction(companyId, values)
        : await createCompanyAction(values);
      if (result?.error) toast.error(result.error);
    }),
  );

  return (
    <form onSubmit={onSubmit}>
      {/* TextField + ChoiceField + AppButton from components/shared */}
    </form>
  );
}
```

**Pages** are a few lines each.

```tsx
// app/(app)/companies/[companyId]/edit/page.tsx
import { getCompany } from "@/features/company/data";
import { CompanySchema } from "@/features/company/schema";
import { CompanyForm } from "@/features/company/components/company-form";

export default async function EditCompanyPage({
  params,
}: PageProps<"/companies/[companyId]/edit">) {
  const { companyId } = await params;
  const company = await getCompany(companyId);
  // parse() turns the stored strings back into the form's types (stage is a string in the database)
  return <CompanyForm companyId={company.id} defaultValues={CompanySchema.parse(company)} />;
}
```

**Errors follow one rule:**

- If a normal user can cause it (for example a duplicate name), return `{ error: "Readable message" }` and show it as a toast.
- Anything else (not logged in, not the owner, database down) throws, and `error.tsx` shows it.

## 4. Code style

**React / Next.js**

- Pages are server components. Add `"use client"` only to the component that needs clicks, typing or state.
- Write `export function Name()`. Use `export default` only in `app/` files, because Next requires it there.
- Put one component per file, and keep files under about 200 lines. Split them into smaller parts when they grow.
- Don't use `useEffect` to fetch data, and don't use Next caching (`"use cache"`). `cacheComponents` is off in `next.config.ts`.

**TypeScript**

- `strict` is on and `any` is not allowed. Use `type`, not `interface`. Don't use `enum`; use the lists in `options.ts`.

**Keep it plain**

- No classes, generic helpers, wrapper functions or `Result` types. Write the direct code, even if it repeats a little.
- Use early returns instead of deep `if`/`else`.
- Don't add a new npm package without agreeing in the group first.
- Comments explain _why_, not _what_.

**Styling**

- Use Tailwind classes only, with no new `.css` files and **no hex colours in classes** (`bg-[#3C3C3C]` is not allowed).
- Use theme colours: `bg-primary`, `text-muted-foreground`, `bg-accent`, or the brand palette (`bg-lilac-50`, `text-neutral-600`, `bg-lime-100`…).
- Don't edit `components/ui/`. To change a look, wrap the component in `components/shared/`.

### Shared components

Every screen is built from the same parts, so a create page, an edit page and a dialog all look alike. Use these instead of the shadcn parts:

| Need                                   | Use                                                 | Instead of                                       |
| -------------------------------------- | --------------------------------------------------- | ------------------------------------------------ |
| Any button or button-styled link       | `AppButton` (`size="lg"` when it sits under fields) | `ui/button`                                      |
| A labelled text, number or email field | `TextField`                                         | `ui/input` + `Field`, `FieldLabel`, `FieldError` |
| A file to upload (drag and drop)       | `FileField`                                         | `TextField` with `type="file"`                   |
| A longer written answer                | `TextareaField`                                     | `ui/textarea` + `Field`, `FieldLabel`            |
| Pick one from a list in `options.ts`   | `ChoiceField`                                       | `ui/radio-group`, `FieldSet`, `FieldLegend`      |
| Pick any number from a list            | `CheckboxField`                                     | `ui/checkbox`, `FieldSet`, `FieldLegend`         |
| A big choice that needs a description  | `ChoiceCardField`                                   | `ui/radio-group`, hand-made cards                |
| "Are you sure?" before a delete        | `ConfirmDialog`                                     | `ui/alert-dialog`                                |
| The heading at the top of a page       | `PageHeader`                                        | a hand-made `<h1>`                               |
| A form with an intro column            | `FormPanel`                                         | your own layout                                  |

If none of these fits, add a new one to `components/shared/` and its shadcn part to `SHARED_ONLY` in `eslint.config.mjs`. Don't style a one-off inside a feature.

**Data and secrets**

- Money is an integer in LKR (`budgetLkr`).
- After `npm run db:migrate`, restart `npm run dev`. The dev server keeps its old Prisma client, which doesn't know the new columns.
- Only server files read `process.env`. Never use `NEXT_PUBLIC_` for a key.
- Never send a company name or personal data to an AI API.

## 5. How the rules are checked

| Rule                                    | Checked by                                         |
| --------------------------------------- | -------------------------------------------------- |
| Formatting, Tailwind class order        | Prettier (`npm run format` fixes it)               |
| No `any`, unused code                   | TypeScript + ESLint                                |
| No feature-to-feature imports, no `../` | ESLint `no-restricted-imports`                     |
| Shared components instead of shadcn     | ESLint `no-restricted-imports` (`SHARED_ONLY`)     |
| Components can't reach the database     | `import "server-only"`                             |
| All of the above                        | `npm run check`, run by GitHub Actions on every PR |

**Pull requests:**

- One feature or fix per PR.
- One teammate reviews it, and `npm run check` must pass.
- The reviewer also checks four things tools can't:
  1. Are the files in the right folders?
  2. Do the names follow section 2?
  3. Does every `data.ts` function start with `requireUser`, `requireCompany` or `requireAdmin`?
  4. Does the PR show a desktop and a phone screenshot of each changed screen, and does it look like the screens next to it?
