---
name: Smart
description: Launch-readiness assessment for Sri Lankan startups. Four modules, traceable scores.
colors:
  neutral-900: "#3c3c3c"
  neutral-800: "#4c4c4c"
  neutral-700: "#5c5c5c"
  neutral-600: "#6c6c6c"
  neutral-550: "#949494"
  neutral-500: "#bcbcbc"
  neutral-400: "#cccccc"
  neutral-300: "#dcdcdc"
  neutral-200: "#ededed"
  neutral-100: "#f4f4f4"
  neutral-50: "#f9f9f9"
  neutral-0: "#ffffff"
  lilac-400: "#6d51ab"
  lilac-300: "#a08cd0"
  lilac-200: "#b9a8e0"
  lilac-100: "#d2c5ef"
  lilac-50: "#f4f2fc"
  blue-300: "#66afea"
  blue-100: "#bfe2fb"
  yellow-300: "#feca00"
  yellow-100: "#ffed6e"
  lime-300: "#c3d100"
  lime-100: "#daf06b"
  destructive: "oklch(0.577 0.245 27.325)"
typography:
  headline:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.55
  body:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  body-small:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.43
  label:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
  wordmark:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "-0.05em"
  numeric:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "1rem"
    fontWeight: 500
    fontFeature: '"tnum" 1'
rounded:
  mark: "3px"
  mark-lg: "7px"
  story: "25%"
  sm: "9.6px"
  md: "12.8px"
  lg: "16px"
  xl: "22.4px"
  2xl: "28.8px"
spacing:
  gap-sm: "12px"
  gap-md: "16px"
  card: "20px"
  page: "24px"
  page-wide: "40px"
  section: "40px"
components:
  button-primary:
    backgroundColor: "{colors.neutral-900}"
    textColor: "{colors.neutral-0}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: "0 20px"
    height: "44px"
  button-primary-large:
    backgroundColor: "{colors.neutral-900}"
    textColor: "{colors.neutral-0}"
    rounded: "{rounded.lg}"
    padding: "0 24px"
    height: "56px"
  button-secondary:
    backgroundColor: "{colors.neutral-0}"
    textColor: "{colors.neutral-900}"
    rounded: "{rounded.lg}"
    padding: "0 20px"
    height: "44px"
  button-danger:
    backgroundColor: "{colors.destructive}"
    textColor: "{colors.neutral-0}"
    rounded: "{rounded.lg}"
    padding: "0 20px"
    height: "44px"
  text-field:
    backgroundColor: "{colors.neutral-0}"
    textColor: "{colors.neutral-900}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: "0 16px"
    height: "56px"
  choice-card:
    backgroundColor: "{colors.neutral-0}"
    textColor: "{colors.neutral-700}"
    rounded: "{rounded.lg}"
    padding: "12px 16px"
    height: "56px"
  choice-card-selected:
    backgroundColor: "{colors.neutral-0}"
    textColor: "{colors.neutral-900}"
  nav-item-active:
    backgroundColor: "{colors.lilac-50}"
    textColor: "{colors.neutral-900}"
    rounded: "{rounded.xl}"
    padding: "12px 16px"
  nav-tab-active:
    backgroundColor: "{colors.lilac-50}"
    textColor: "{colors.neutral-900}"
    typography: "{typography.label}"
    rounded: "{rounded.xl}"
    padding: "0 16px"
    height: "44px"
  admin-chip:
    backgroundColor: "{colors.neutral-100}"
    textColor: "{colors.neutral-700}"
    rounded: "{rounded.md}"
    padding: "4px 8px"
  filter-pill:
    backgroundColor: "{colors.neutral-0}"
    textColor: "{colors.neutral-700}"
    typography: "{typography.label}"
    rounded: "{rounded.xl}"
    padding: "0 16px"
    height: "44px"
  filter-pill-active:
    backgroundColor: "{colors.neutral-900}"
    textColor: "{colors.neutral-0}"
    typography: "{typography.label}"
    rounded: "{rounded.xl}"
    padding: "0 16px"
    height: "44px"
  file-drop-zone:
    backgroundColor: "{colors.neutral-0}"
    textColor: "{colors.neutral-900}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: "40px 16px"
  file-drop-zone-dragging:
    backgroundColor: "{colors.lilac-50}"
    textColor: "{colors.neutral-900}"
    rounded: "{rounded.lg}"
    padding: "40px 16px"
  progress-square-sm:
    backgroundColor: "{colors.blue-300}"
    rounded: "{rounded.mark}"
    size: "10px"
  progress-square-lg:
    backgroundColor: "{colors.blue-300}"
    rounded: "{rounded.mark-lg}"
    size: "28px"
  story-square-md:
    backgroundColor: "{colors.lilac-300}"
    textColor: "{colors.neutral-900}"
    rounded: "{rounded.story}"
    size: "96px"
  story-square-lg:
    backgroundColor: "{colors.lilac-300}"
    textColor: "{colors.neutral-900}"
    rounded: "{rounded.story}"
    size: "144px"
  coverage-panel:
    backgroundColor: "{colors.neutral-0}"
    textColor: "{colors.neutral-900}"
    rounded: "{rounded.xl}"
    padding: "{spacing.page}"
  auth-preview-panel:
    backgroundColor: "{colors.neutral-50}"
    textColor: "{colors.neutral-900}"
    rounded: "{rounded.2xl}"
    padding: "48px 40px"
  landing-close-panel:
    backgroundColor: "{colors.neutral-50}"
    textColor: "{colors.neutral-900}"
    rounded: "{rounded.2xl}"
    padding: "48px 24px"
  module-card:
    backgroundColor: "{colors.neutral-0}"
    textColor: "{colors.neutral-900}"
    rounded: "{rounded.xl}"
    padding: "{spacing.card}"
  module-icon-infrastructure:
    backgroundColor: "{colors.blue-100}"
    textColor: "{colors.neutral-900}"
    rounded: "{rounded.lg}"
    size: "44px"
  module-icon-marketing:
    backgroundColor: "{colors.yellow-100}"
    textColor: "{colors.neutral-900}"
    rounded: "{rounded.lg}"
    size: "44px"
  module-icon-compliance:
    backgroundColor: "{colors.lilac-100}"
    textColor: "{colors.neutral-900}"
    rounded: "{rounded.lg}"
    size: "44px"
  module-icon-product:
    backgroundColor: "{colors.lime-100}"
    textColor: "{colors.neutral-900}"
    rounded: "{rounded.lg}"
    size: "44px"
---

# Design System: Smart

## Overview

**Creative North Star: "Four Squares"**

The four modules are the brand. Infrastructure, Marketing, Compliance and Product each own one pastel colour, and the logo is just those four colours as a 2x2 grid. Everything else stays quiet: charcoal text on white, thin grey lines, soft 16px corners. Colour on a screen should tell you which module you are looking at, and nothing else.

The app is a working tool for technical founders, and it is checked by experts and SUS testers. So screens are calm, roomy and easy to scan. One clear heading, short grey lines under it, cards with a thin border and no shadow. Text is plain and direct, a little warm: "62 out of 100. Power backup is the biggest gap."

The name "Smart" may become "Nexaura". The mark is not a letter, so it survives the rename. The name is written only in `app-logo.tsx` and the root layout metadata.

**Key Characteristics:**

- Charcoal ink (neutral-900) on white. Never pure black.
- One pastel per module, and module colours mean "this module" only.
- Lilac-400 is the interaction colour: focus rings and accent text.
- Flat. Borders and soft grey panels, not shadows.
- 16px corners on controls, about 22px on cards and nav items.
- Geist for everything; Geist Mono only for numbers people compare.
- Big touch targets: 44px buttons, 56px fields and choice cards.

## Colors

A quiet charcoal-and-white base, one lilac for interaction, and four pastel module colours.

### Primary

- **Charcoal Ink** (neutral-900): Headings, body text, the primary button fill, the selected choice card ring, the active nav icon tile. It is the shadcn `primary` and `foreground`.

### Secondary

- **Signal Lilac** (lilac-400): Focus rings (`ring`), accent text (`accent-foreground`), the text caret in inputs, and score citation numbers. Use it for "you can act here" and "you are here", not for decoration.
- **Lilac Wash** (lilac-50): Background of the active sidebar item and admin tab, the file drop zone while a file is dragged over it, and the shadcn `accent` surface (menu hover).
- **Selection** (lilac-200 behind charcoal text): the browser's text selection highlight, set in `globals.css`. Lilac-200 belongs to no module, so the Module Colour Rule holds.

### Tertiary: the module colours

Each module has a light shade (100) for icon tiles and backgrounds, and a strong shade (300) for the logo mark, the progress mark, module squares in lists and filters, and score bars.

- **Infrastructure Sky** (blue-100 tile, blue-300 strong)
- **Marketing Sun** (yellow-100 tile, yellow-300 strong)
- **Compliance Lavender** (lilac-100 tile, lilac-300 strong)
- **Product Lime** (lime-100 tile, lime-300 strong)

Module order is always Infrastructure, Marketing, Compliance, Product. The 100 map lives in `components/shared/module-icon.tsx`; the 300 map is `MODULE_STRONG_COLOURS` in `components/shared/progress-mark.tsx`. Use those maps; don't write the module colour classes again.

### Neutral

- **Paper** (neutral-0): Page and card background.
- **Mist** (neutral-50): Sidebar surface.
- **Fog** (neutral-100): Grey form panel, `muted` and `secondary` surfaces, nav hover.
- **Hairline** (neutral-200 / neutral-300): Panel borders (200) and the default `border` for cards, dividers and table rows (300).
- **Field Edge** (neutral-550): Input and choice card borders, secondary button border, the dashed drop zone and empty-list borders, the "Not started" and "Uploaded" dots, quiet icons (chevrons, the open-link arrow). It meets 3:1 against white, which lighter greys don't.
- **Quiet Text** (neutral-600): Descriptions, labels in detail rows, "Not set" values.
- **Soft Text** (neutral-700): Unselected choice card text, inactive nav items.
- **Danger** (shadcn red, `destructive`): Delete buttons and delete menu items only.

### Named Rules

**The Module Colour Rule.** Blue, yellow, lime and the lilac 100/300 shades belong to the four modules. Never use them for generic decoration, status (success, warning) or charts that are not about modules.

**The Lilac Means Interaction Rule.** Lilac-400 marks focus and accent text. A screen that uses it as a background fill or for a heading has misused it.

**The Hex Lives In One File Rule.** Every colour is a token in `src/app/globals.css`. Classes use the token names (`bg-lilac-50`, `text-neutral-600`), never `bg-[#...]`.

## Typography

**Body Font:** Geist (via `next/font`, `--font-sans`), also used for headings.
**Numeric Font:** Geist Mono (`--font-mono`), with tabular figures.

**Character:** One clean sans for all text, so the page reads as one voice. The mono is a tool for lining up numbers, not a style.

### Hierarchy

- **Landing headline** (700, 36px on phones, 48px from lg, tight tracking, balanced lines): The landing hero's h1 only, written by hand instead of `PageHeader`. An 18px Quiet Text line sits under it.
- **Headline** (700, 24px on phones, 30px from sm, tight tracking): The one page title, through `PageHeader`. Landing section headings use the same steps.
- **Dialog title** (700, 20px): `ConfirmDialog` titles.
- **Title** (700, 18px): Section headings such as "Assessments" and "Company details", and the `FormPanel` heading.
- **Card title** (700, 16px): Module names on cards.
- **Body** (400, 16px): Default text, field text (16px stops iOS zoom), button labels, page descriptions (max about 42rem).
- **Body small** (400, 14px): Card descriptions, status lines, form panel intros, nav items (500).
- **Label** (500, 14px): Field labels, choice group legends, admin tabs and filter pills.
- **Small print** (12px): Footnotes under a source list (400) and the "Admin" chip (600).
- **Wordmark** (700, 20px, tracking -0.05em, lowercase "smart"): The logo only.

### Named Rules

**The Mono Is For Numbers Rule.** Use Geist Mono with tabular figures only for numbers people compare: scores, LKR amounts, source numbers. Never use mono as a "technical" costume for labels, headings or code-ish decoration.

**The Bold Not Big Rule.** Hierarchy comes from weight (700) and a short size step, not from huge display type. The largest text in the app is the 30px page title. The one exception is the logged-out landing page, which has to win attention before anyone has an account: its hero headline is 36px, 48px from lg. App, auth and admin pages still top out at 30px.

## Layout

- **App shell:** a 288px sidebar on the left from md (768px) up. Below md it becomes a slim sticky top bar with the logo and a menu button that opens the same links in a left sheet.
- **Content column:** centred, max 64rem, padding 24px on phones and 40px from md.
- **Auth pages:** from lg (1024px) up, a split screen. The form sits on the left in a column of max 24rem, with the logo above it. The right 46% (max 48rem) is an inset panel with an example company sheet (see "Auth preview"). Below lg there is only the logo and the form, because the example would push the fields a full screen down.
- **Admin area:** no sidebar. A sticky top bar with a bottom hairline holds the logo, an "Admin" chip, the tabs, "Back to app" at the far end, and a compact user menu. On phones the tabs drop to a second row under the logo and menu. Content column max 64rem, same padding as the app.
- **Landing page (`/`, logged-out visitors only):** a slim header (logo left, a secondary "Log in" right) and a content column of max 72rem (`max-w-6xl`), 24px side padding, 40px from md.
  - **Story (lg up):** two columns, 64px apart. The left column holds the hero, then four example steps, one per module in module order, each at least 80% of the screen height and vertically centred. The right column is a sticky, full-height column with the large story mark centred in it and its caption under it.
  - **Story (below lg):** one column. The finished md story mark (all four filled) and its caption sit under the hero; each step header carries an lg `ProgressMark` filled up to that step, because there is no big mark beside the text.
  - **Then:** the method row (four columns from lg, two from sm), a "Built on Sri Lankan facts" row (heading left, a two-column list of facts on hairlines right), and the close panel with a 12px research note under it.
- **Rhythm:** 40px between page sections, 16px between cards, 12px between choice cards, 8px between a heading and its line.
- **Module cards:** one column on phones (icon left, text right), two from sm, four from lg (stacked, status line pinned to the bottom with a divider).
- **Detail rows:** label left, value right, divider under each row; two columns from sm.
- **Forms:** `FormPanel` puts a white intro column next to the grey field panel only from xl. Below that the intro sits on top. Choice cards follow the form's width (container queries), not the window's.
- **Touch:** on touch screens every button, input, select and menu item grows to at least 44px (`globals.css`).

## Elevation & Depth

The app is flat. Depth comes from tone and lines: white cards with a hairline border, a grey (neutral-100) panel behind form fields, a light grey (neutral-50) sidebar. The only shadows are the ones shadcn puts on floating layers (sheet, dialog, menu), and those come from `components/ui/` unchanged.

### Named Rules

**The Flat Card Rule.** Cards and panels never get a shadow. Use a border and a tone change instead.

## Shapes

One base radius (1rem) drives everything. Buttons, fields, choice cards and module icon tiles use 16px. Cards, nav items and the form panel use the larger step (about 22px). Icon chips inside nav items use the medium step (about 13px). Status dots are full circles. The logo and progress mark squares are the one exception: 10px squares with 3px corners (28px with 7px corners in the large mark), so they read as tiles, not dots. The landing story mark scales the same tile up with corners at a quarter of the square's side (25%). The auth preview panel uses the largest step (about 29px), because it holds a card inside it. Icons are Lucide at stroke width 1.5, 16 to 20px.

## Components

Built from `src/components/shared/`. Use these, not the raw shadcn parts.

### Buttons (`AppButton`)

- **Shape:** soft corners (16px), 16px label.
- **Sizes:** md is 44px tall with 20px side padding. lg is 56px with 24px padding, for a submit button under 56px fields.
- **Primary:** charcoal fill, white text. Hover fades the fill to 80%.
- **Secondary:** white with a Field Edge (neutral-550) border and charcoal text.
- **Danger:** solid red fill, white text. Only for confirming a delete.
- **Ghost:** no fill or border; for icon buttons like the phone menu (44px square).
- **Focus:** lilac-400 border plus a 3px lilac-400 ring at 50%.

### Inputs / Fields (`TextField`)

- **Style:** 56px tall, white, 16px corners, Field Edge border, 16px side padding, 16px text. Label above, error below.
- **Focus:** lilac-400 border and a 3px lilac ring at 50%.
- **Error:** red border and a faint red ring; message under the field.

### Choice cards (`ChoiceField`)

- **Style:** at least 56px tall, the whole card is clickable, radio on the left, 16px medium text in Soft Text.
- **Hover:** border darkens to neutral-600.
- **Selected:** charcoal border plus a 1px charcoal ring, text turns charcoal.
- **Layout:** one column, two from small container width, three in a row when there are exactly three options.

### Cards / Containers

- **Module card:** white, hairline border, about 22px corners, 20px padding, no shadow. Holds the module icon tile, a bold name, a short grey description and a status line.
- **Form panel (`FormPanel`):** grey neutral-100 panel with a neutral-200 border and about 22px corners; white intro column with a 192px line illustration on wide screens.
- **Confirm dialog (`ConfirmDialog`):** max 28rem, 24px padding (32px from sm), Cancel (secondary) then the red confirm button; stacked full width on phones.

### Navigation (`AppSidebar`, `SidebarNav`)

- **Items:** 14px medium, 12px by 16px padding, about 22px corners. Inactive is Soft Text with a Fog hover. Active is a Lilac Wash background with charcoal text, and its icon chip turns charcoal with a white icon.
- **New company:** a dashed Field Edge border item at the end of the list.
- **Phone:** top bar plus a left sheet with the same items; tapping a link closes it.

### Module icon (`ModuleIcon`)

A 44px tile with 16px corners in the module's 100 shade and a charcoal Lucide icon (stroke 1.5): Server, Megaphone, Scale, Package.

### The mark (`AppLogo`)

A 2x2 grid of 10px squares with 2px gaps, in the module 300 shades and module order (blue, yellow, lilac, lime), next to the lowercase bold "smart" wordmark. The link is 44px tall so it is a full tap target. It goes to `/companies` by default; it takes an optional `href`, and the landing page passes `/` because logged-out visitors can't open `/companies`.

### Progress mark (`ProgressMark`)

The logo's 2x2 grid, used to say which modules are "there". A filled square is the module's 300 colour. An empty square is white with a 1.5px neutral-300 outline. Squares always sit in module order.

- **Sizes:** sm is 10px squares, 3px corners, 2px gaps. lg is 28px squares, 7px corners, 6px gaps.
- **Uses today:** admin coverage (a square fills when the module has at least one document), the mark for shared documents (all four filled), the example sheet on the auth pages, the landing step headers on phones (lg, filled up to that step), and the landing close panel (lg, all four filled). Per-company assessment progress is the next use.
- **Decorative:** it is `aria-hidden`. The text next to it always says the same thing in words.

### Story mark (`StoryMark`, landing only)

The logo's 2x2 grid at page size, with each module's example score inside its square.

- **Sizes:** md is 96px squares with 20px gaps and a 24px score (the phone mark). lg is 144px squares, 160px from xl, with 32px gaps and a 36px score (the sticky mark).
- **Empty:** white with a 1.5px neutral-300 outline, no score.
- **Filled:** the module's 300 colour (from `MODULE_STRONG_COLOURS`), the border turns transparent, and the score shows in Geist Mono medium charcoal with tabular figures.
- **Names outside:** module names (14px medium) sit above the top row and below the bottom row, never inside a square, because 14px charcoal on lilac-300 is under 4.5:1. The large score inside passes as large text. Names are Quiet Text while empty and charcoal once filled.
- **Caption:** an "Example" badge and "N of 4 modules scored", with N in Geist Mono. The mark is `aria-hidden`; the caption and the steps say it in words.
- **Motion:** the one authored motion on the landing page. When a step's top passes the middle of the screen, its square's colour scales from 0 to 1 from the centre (500ms) and the score fades in after a 150ms delay (300ms), both on `cubic-bezier(0.16, 1, 0.3, 1)`. Scrolling back up empties the squares again. With reduced motion the transitions are off and squares change at once.

### Landing example step (`ModuleStep`)

- **Header:** the module icon tile, the module name as an 18px bold heading, its grey description; on phones the lg `ProgressMark` at the end.
- **Figure:** a white card with a hairline border and about 22px corners, max 36rem. The question in bold, then the answers drawn like choice cards (56px, 16px corners, Field Edge border, radio on the left; the picked one has the charcoal border, ring and filled dot). They are a picture of the form and can't be clicked.
- **Score block** (under a divider): "Score" in bold with an "Example" badge, the score as "62 of 100", an 8px score bar in the module 300 colour, the gap line in Quiet Text with a lilac-400 citation, then "Fix first:" in semibold charcoal followed by the fix.
- **Footnote** (under a divider): 12px Quiet Text with the same lilac number and the source.

### Landing method row and close

- **Method row:** four steps in reading order (an ordered list) as plain columns, not cards. Each has a 1px charcoal rule on top, a bold 16px title and a 14px grey line. It reads left to right as a sequence.
- **Close panel:** the auth preview's surface (Mist, neutral-200 border, about 29px corners), 48px by 24px padding, 64px from lg. The lg `ProgressMark` (all filled) next to a 24px bold heading and a grey line, and the lg primary "Check your company" button at the far end from md.

### Module square

One 10px square with 3px corners in a module's 300 colour (12px in library rows). It leads document rows and filter pills so a mixed list can be scanned by colour. A shared document shows the full sm mark instead.

### Coverage ledger (`ModuleCoverage`)

- **Panel:** white, hairline border, about 22px corners. The top row has the lg progress mark next to a bold 18px summary sentence ("3 of 4 modules have sources") and a grey line naming the modules with none.
- **Rows:** one per module plus Shared. Icon tile, bold name, one 10px module square per document (up to 12, then "+N"), a grey breakdown ("2 papers · 1 guide"), the count in Geist Mono 18px, and a chevron. A row with no documents shows one empty outlined square and "No sources yet".
- **Links:** each row opens the library filtered to that module. Hover and focus turn the row Mist (neutral-50); focus also adds an inset lilac ring.
- **Phones:** the squares hide and the breakdown moves under the name.

### Filter pills (`ModuleFilter`)

Plain links with `?module=`, so a filtered list has its own URL. 44px tall, about 22px corners, a neutral-300 border, 14px medium Soft Text, then a module square, the label and a Geist Mono count in Quiet Text. Hover darkens the border to Field Edge. Active is a charcoal fill and border with white text and a neutral-300 count.

### Document rows (`DocumentList`)

Rows, not a table, inside one bordered panel with dividers, so they read the same on a phone. Each row: module square, bold title link that opens the file (with a quiet up-right arrow), a grey meta line ("Marketing · Paper · Name, 9 Oct 2026"), a status dot with its label from sm, and a delete button. Status dots: Field Edge for "Uploaded", charcoal for "Processed". An empty list is a dashed Field Edge box with centred grey text.

### File field (`FileField`)

- **Drop zone:** white, dashed Field Edge border, 16px corners, 40px top and bottom padding. A 44px Fog icon tile with an upload icon, then "Drag a file here or browse" (browse underlined). Hover darkens the border and turns the zone Mist.
- **Dragging:** the border turns solid lilac-400 and the zone Lilac Wash; the text reads "Drop the file here".
- **Chosen file:** a file card with a Fog icon tile, the file name, its size, and a 44px ghost remove button. While uploading, the size line shows the percent and a 6px charcoal progress bar runs on a neutral-200 track.
- **Focus and error:** same as `TextField` (lilac ring, red border).

### Notices

A rule the user must read before acting (for example "Published sources only") is a white box with a neutral-300 border, 16px corners, a charcoal Lucide icon and 14px Soft Text with a semibold charcoal lead. It sits first in the form. Notices stay neutral: no yellow, because yellow is Marketing.

### Admin bar (`AdminNav`)

- **Chip:** "Admin" next to the logo, Fog background, about 13px corners, 12px semibold Soft Text.
- **Tabs:** styled like sidebar items: 44px tall, about 22px corners, 14px medium. Inactive is Soft Text with a Fog hover. Active is Lilac Wash with charcoal text.
- **Back to app:** at the far end, away from the tabs, because it leaves the admin area. Quiet Text with a left arrow.

### Auth preview (`AuthPreview`)

The right half of the login and signup pages, from lg up. An inset Mist (neutral-50) panel with a neutral-200 border and about 29px corners. It holds a bold 24px heading and a grey line, then a white example sheet: a header with the sm progress mark, "Your company" and a secondary "Example" badge; four module rows (icon tile, name, then a score or a status dot); and a footnote. It is all sample data and is labelled that way.

### Scores and sources (partly live: the sample in the auth preview)

- Scores read "62 of 100"; criterion scores read "1.5 of 5". The number is in Geist Mono with tabular figures, 18px medium charcoal; "of 100" is 14px Quiet Text.
- Every score on screen carries a small numbered citation: superscript, bold, lilac-400. It points to a numbered source list on the same screen (for example "Weights: AHP, expert panel"), shown as a 12px footnote with the same lilac number.
- Score bars are 8px tall and fully rounded, in the module's 300 shade on a Fog track. The auth preview bar fills in once on load (only when motion is allowed). The only other authored motion is the landing story mark's square fill (see "Story mark"); nothing else moves.
- Status dots: "Not started" is a Field Edge dot, "Draft" is a 1.5px charcoal ring.
- Score values come only from the engine, never from LLM text. Real assessment scores are not built yet.

### Dark mode (not designed yet)

The `.dark` block in `globals.css` is shadcn's untouched default and the app never turns it on. There is no dark palette yet. Don't build dark styles on top of it.

## Do's and Don'ts

### Do:

- **Do** build every screen from the shared components (`AppButton`, `TextField`, `ChoiceField`, `ConfirmDialog`, `PageHeader`, `FormPanel`). The landing hero headline is the one hand-made page heading.
- **Do** keep module colours in module order: Infrastructure blue, Marketing yellow, Compliance lilac, Product lime.
- **Do** use the 100 shade for module tiles and backgrounds, and the 300 shade for the marks, module squares and score bars.
- **Do** show counts as module squares (one per item, then "+N") and a Mono number, not as full-width bars.
- **Do** use `ProgressMark` and `MODULE_STRONG_COLOURS` for module squares instead of writing the colour classes again.
- **Do** use lilac-400 for focus and interaction, and charcoal (neutral-900) for primary actions and selected states.
- **Do** keep touch targets at least 44px and fields and choice cards 56px.
- **Do** show unset values as "Not set" in Quiet Text (neutral-600), not as a dash or blank.
- **Do** put Geist Mono with tabular figures on scores, LKR amounts and source numbers.
- **Do** check every screen at 390px and at laptop width.
- **Do** label sample data as "Example" when it shows before a user has real data.

### Don't:

- **Don't** use module colours for decoration, status or generic charts.
- **Don't** use module yellow for warnings or notices; use a neutral bordered notice with an icon.
- **Don't** draw a count as a bar. A full bar reads as a top score, and one document is not "complete".
- **Don't** write hex colours in classes; add a token to `globals.css` instead.
- **Don't** add shadows to cards or panels.
- **Don't** use Geist Mono for labels, headings or anything that is not a compared number.
- **Don't** write the product name anywhere except `app-logo.tsx` and the root layout metadata.
- **Don't** edit `components/ui/`; wrap the part in `components/shared/`.
- **Don't** design dark mode by editing the shadcn `.dark` block piecemeal.
