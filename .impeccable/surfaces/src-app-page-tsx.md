---
version: 1
slug: "src-app-page-tsx"
primary_target: "src/app/page.tsx"
related_targets: ["src/features/landing"]
---

Scope: / for logged-out visitors (logged-in users still go to /companies). Mode: Persuade.
Audience: Sri Lankan technical founders, plus SUS testers on laptops; must work at 390px.
Job: understand what this is in one screen, then "Check your company" (→ /signup); "Log in" for returning founders.
Proof: a labelled Example company scored in all four modules (sample data, never presented as real); the method (engine decides, AI explains, sources on every rule). No invented stats, prices, users or partner logos. No product name in copy.
Constraints: Four Squares world unchanged; shared components only; module colours mean modules only.

## Direction contract

THESIS: The logo's 2x2 mark is the page. It sits large and still while the visitor scrolls, and fills one module square per section with an example score; refuses the split hero with a screenshot and the row of four feature cards.
OWN-WORLD: Four Squares: charcoal on white, hairline rules, flat cards, 16/22px corners, module 300 squares with Geist Mono scores, lilac-400 citations, choice-card answers.
STORY: visitor reads the promise, sees four empty squares labelled with the modules, scrolls through one example question per module as each square fills with its score and gap, learns the engine decides and the AI only explains, then checks their own company.
FIRST VIEWPORT: lg+: slim bar (logo left, Log in right). Left column: 48px bold headline, one grey paragraph, primary 56px "Check your company" + Log in. Right column: sticky, vertically centred, the 2x2 mark at ~160px squares, outlined and empty, module names outside the squares, caption "Your company · 0 of 4 checked". The Infrastructure step header peeks at the fold. Phones: headline, copy, action, a filled example mark; each step carries its own lg ProgressMark.
FORM: Fill the mark (scroll-filled sticky mark); position 7 of 7 on the ranked list; seed key 31cfc46b. Signature interaction: a square fills (scale from its centre, ease-out, motion-safe) as its step reaches mid-screen, reversible on scroll up.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
