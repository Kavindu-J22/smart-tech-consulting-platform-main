---
version: 1
slug: "src-app-admin"
primary_target: "src/app/(admin)"
related_targets: []
---

Scope: /admin (overview), /admin/documents (library), /admin/documents/new (upload). Mode: Operate.
Audience: the one admin level; uploads published sources the module RAG draws on. Task: see which modules lack sources, add a document, find or delete one.
Constraints: established Four Squares world (DESIGN.md), shared components only, real data only.

## Direction contract

THESIS: Coverage, not counts. The overview answers "which modules have sources?" with the 2x2 mark itself; refuses the KPI-tile dashboard.
OWN-WORLD: charcoal on white, hairline rows, module 300 squares and bars as the only colour, Geist Mono tabular counts, lilac-50 active nav.
STORY: admin sees the mark (filled squares = modules with sources) and a one-line summary, scans a per-module ledger, adds a document where a row is empty.
FIRST VIEWPORT: PageHeader "Overview" + Add document button right; a white panel with a 64px coverage mark beside the summary sentence; the five-row ledger (four modules + shared) below, counts drawn as one module-300 square per document (never a full bar); recent uploads after.
FORM: ledger rows with per-document module squares; shaped directly (narrow request after answers), no seed.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
