---
doc: checklist
status: approved
---

# Build Checklist

Build mode: fast

## Slices

- [x] **1. Scaffolding, 12-column grid dashboard, and sample Threads loader**
  Becomes usable: A running Next.js web application at `http://localhost:3000` with the rigid 12-column shadcn/ui-inspired layout, Header, InputWorkbench with textarea, "Load Sample Scraped Data" button that populates realistic raw Threads posts, Clear button, and client-side pre-validation alert banner.
  Why now: Bootstraps Next.js with TypeScript and Tailwind CSS, and provides the interactive surface and realistic test input needed for everything else.
  PRD ref: `prd.md > The Core Journey` (steps 1-3), `prd.md > Screens and Layout`, `prd.md > Features and Behavior (Data Ingestion & Sanitization)`
  Spec ref: `spec.md > Stack`, `spec.md > Components (Header, InputWorkbench)`, `spec.md > File Structure`
  Build: Initialize Next.js app structure, configure Tailwind CSS and theme tokens, add sample scraped Threads dataset (`sampleThreadsData.ts`), build `Header` and `InputWorkbench` with client-side empty-input pre-validation.
  Verify (mechanical): Run dev server and verify HTTP 200 on `http://localhost:3000`; test client validation triggers inline alert when input is empty.
  Learner check: Open `http://localhost:3000`, click "Load Sample Scraped Data" to see messy Threads posts fill the box, try submitting empty to see the inline error.
  Commit: `feat: scaffold Next.js app with 12-column dashboard and sample Threads loader`

- [x] **2. Server-side Gemini extraction with PII sanitization and Zod schema validation**
  Becomes usable: An active `/api/extract` backend route that calls Gemini 2.5 Flash to strip PII (usernames, handles, contact info), classify posts into target categories (Sports, Politics, Tech, etc.), and infer demographic signals (Age Group & Gender, marking ambiguous items as `"Unspecified"`), with Zod schema validation and error fallback.
  Why now: Delivers and proves the unique kernel and biggest technical risk first—proving the AI model strictly produces schema-compliant, privacy-scrubbed JSON before wiring the full analytics view.
  PRD ref: `prd.md > Features and Behavior (Data Ingestion & Sanitization, Category & Topic Classification, Demographic Inference & Outlier Handling)`
  Spec ref: `spec.md > Stack`, `spec.md > Components (api/extract/route.ts)`, `spec.md > Data Model`, `spec.md > External Services and Dependencies`
  Build: Create `schemas.ts` with Zod schemas and TypeScript interfaces; configure Gemini API client in `gemini.ts`; implement `api/extract/route.ts` with structured JSON output instructions and Zod validation; add `.env.example`.
  Verify (mechanical): Execute an automated test request against `api/extract` sending raw sample posts and verify HTTP 200 response matching the Zod schema, with zero PII and valid categories.
  Learner check: Review the extracted JSON payload returned from the API and confirm handles and emails are stripped while categories are accurately assigned.
  Commit: `feat: implement server-side Gemini extraction with PII removal and Zod validation`

- [x] **3. Analytical metrics calculation with demographic outlier isolation and dashboard visualization**
  Becomes usable: Full end-to-end analytical dashboard. Clicking "Extract & Transform" transitions through a skeleton loading state, then renders summary metrics: Total Posts, PII Scrubbed badge, Category Distribution percentage bars, and Demographic Split (Age Group & Gender) where `"Unspecified"` posts are cleanly isolated as an outlier badge rather than skewing the percentage breakdown.
  Why now: Delivers the primary product value for the data analyst—instant aggregate insights with statistically sound outlier handling.
  PRD ref: `prd.md > The Core Journey` (steps 4-5), `prd.md > Features and Behavior (Category & Topic Classification, Demographic Inference & Outlier Handling)`
  Spec ref: `spec.md > Components (AnalyticsOverview)`, `spec.md > Data Model (PipelineMetrics)`
  Build: Implement `metrics.ts` to compute category percentages and demographic percentages (excluding `"Unspecified"` from base percentage while counting outliers); create `AnalyticsOverview.tsx` with progress bars, metric cards, and outlier badges; wire up page state and skeleton loaders.
  Verify (mechanical): Pass a test dataset with 10 posts (including 2 unspecified demographics) to `calculateMetrics` and mechanically verify percentages sum correctly and outlier count equals 2; verify UI renders metric cards.
  Learner check: Click "Extract & Transform" on sample data and verify the percentage distributions and outlier badges calculate and display cleanly on the 12-column grid.
  Commit: `feat: add analytics metrics overview with demographic outlier handling`

- [x] **4. Sanitized records table, raw JSON viewer with 1-click copy, and end-to-end integration**
  Becomes usable: Complete proof of concept ready for demo recording. Below the analytics overview, analysts can inspect individual sanitized posts in a clean table/card list (verifying PII removal post-by-post), toggle the raw validated JSON viewer, and click "Copy JSON" to receive immediate visual confirmation.
  Why now: Completes the entire core loop and demo flow—providing the exportable artifact and inspection tool needed for a 60-second walkthrough video.
  PRD ref: `prd.md > The Core Journey` (step 5), `prd.md > Features and Behavior (Schema-Validated JSON Output)`, `prd.md > Look and Feel`
  Spec ref: `spec.md > Components (SanitizedRecordsTable, JsonOutputViewer)`, `spec.md > Where It Runs and How Someone Tries It`
  Build: Implement `SanitizedRecordsTable.tsx` and `JsonOutputViewer.tsx` with clipboard copy feedback; integrate into `page.tsx` on the 12-column grid; verify strict no-emoji styling and Lucide icons.
  Verify (mechanical): Run a full production build (`npm run build`) with zero TypeScript or lint errors; run dev server and verify end-to-end flow from load sample to extraction to JSON copy.
  Learner check: Run the complete 60-second demo journey: click sample data -> click extract -> review metrics -> inspect records table -> copy JSON.
  Commit: `feat: add sanitized records table and interactive JSON viewer with copy action`

## Hands-on Checkpoints

- [x] Early usable behavior explored — Slice 2 (server-side Gemini extraction and PII scrubbing verified)
- [x] Final kick-the-tires exploration and feedback completed

## Final Review

- [x] Final review complete — feedback resolved and learner confirms ready to ship

## Code Tour and App Map

- [x] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [x] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [x] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence: Tested live production build and verified full end-to-end extraction output (8 posts, 6 PII scrubbed, category breakdown, 5 age/gender unspecified outliers isolated); verified strict Zod schema compliance in API response.
Route and stops: src/components/InputWorkbench.tsx, src/app/api/extract/route.ts, src/lib/metrics.ts, src/components/AnalyticsOverview.tsx, src/components/JsonOutputViewer.tsx
Edit outcome: not applicable (all features verified working as planned)
Reflection: already covered through focused alternative and validation of the outlier mathematical model
Activity mode: live app and focused alternative

## Revisions

None required — build executed exactly against approved spec.
