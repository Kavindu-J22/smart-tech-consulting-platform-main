import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Every feature folder. Add a new feature here when you create its folder.
const FEATURES = [
  "auth",
  "company",
  "knowledge",
  "landing",
  "infrastructure",
  "marketing",
  "compliance",
  "product",
];

// CONVENTIONS.md: pages and features use the shared version of these, so every screen looks
// the same. Only components/shared/ may import them from components/ui/.
const SHARED_ONLY = [
  { name: "@/components/ui/button", message: "Use AppButton from @/components/shared/app-button." },
  { name: "@/components/ui/input", message: "Use TextField from @/components/shared/text-field." },
  {
    name: "@/components/ui/field",
    importNames: ["Field", "FieldLabel", "FieldError", "FieldSet", "FieldLegend"],
    message: "Use TextField or ChoiceField from @/components/shared/.",
  },
  {
    name: "@/components/ui/radio-group",
    message: "Use ChoiceField from @/components/shared/choice-field.",
  },
  {
    name: "@/components/ui/alert-dialog",
    message: "Use ConfirmDialog from @/components/shared/confirm-dialog.",
  },
  {
    name: "@/components/ui/textarea",
    message: "Use TextareaField from @/components/shared/textarea-field.",
  },
  {
    name: "@/components/ui/checkbox",
    message: "Use CheckboxField from @/components/shared/checkbox-field.",
  },
];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // CONVENTIONS.md: no `any`, and always import with "@/…", never "../".
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "no-restricted-imports": [
        "error",
        { patterns: [{ group: ["../*"], message: 'Import with "@/…" instead of "../".' }] },
      ],
    },
  },

  {
    files: ["src/app/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: SHARED_ONLY,
          patterns: [{ group: ["../*"], message: 'Import with "@/…" instead of "../".' }],
        },
      ],
    },
  },

  // CONVENTIONS.md: a feature never imports another feature,
  // except the shared company feature (options + schema).
  ...FEATURES.map((feature) => ({
    files: [`src/features/${feature}/**`],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: SHARED_ONLY,
          patterns: [
            { group: ["../*"], message: 'Import with "@/…" instead of "../".' },
            {
              // any "@/features/…" import except its own folder and company/options or company/schema
              regex: `^@/features/(?!${feature}/|company/options$|company/schema$)`,
              message: "A feature may not import another feature (see CONVENTIONS.md).",
            },
          ],
        },
      ],
    },
  })),

  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", "src/generated/**"]),
]);

export default eslintConfig;
