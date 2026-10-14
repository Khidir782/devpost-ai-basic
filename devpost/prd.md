---
doc: prd
status: approved
---

# Threads Insight Pipeline — Product Requirements

A minimalist, privacy-safe analytics workbench that ingests raw scraped Meta Threads posts, strips PII, and outputs validated structured JSON alongside category and demographic percentage distributions for data analysts.
Source: `scope.md > The Core Loop`, `scope.md > The Unique Kernel`.

## The Core Journey
1. **Arrival & Initial View:** The analyst lands on a clean, single-surface dashboard structured on a 12-column grid. An input card with a text area and action controls is ready for input.
2. **Input Provision:** The analyst can either paste raw scraped Threads data (raw text dumps, hashtags, slang) or click **"Load Sample Scraped Data"** to instantly test with realistic pre-scraped samples.
3. **Pre-Validation:** When the analyst clicks **"Extract & Transform"**, client-side validation instantly verifies that input is present and non-empty. If invalid, an inline alert triggers without sending a network request.
4. **Backend Processing:** Once validated, the UI displays an active processing state (skeleton loader / subtle progress indicator) while the backend runs PII sanitation, category classification, and demographic inference.
5. **Results & Analytics Inspection:**
   - **Summary Distribution Cards:** Displays percentage breakdowns for topics/categories (e.g. Sports, Politics, Tech, Lifestyle).
   - **Demographic Split:** Shows identified Age Group and Gender distributions. Posts with no clear signals are marked as `"Unspecified"` and treated as outliers—noted with an outlier counter/badge so they do not mathematically distort identified percentages.
   - **Sanitized Records View:** Clean table or card list showing the sanitized text, category tag, and demographic labels with zero PII.
   - **Validated JSON Export:** A dedicated code viewer displaying the valid JSON schema with a one-click **"Copy JSON"** button.

## Screens and Layout
A unified single-screen workbench built on a flexible 12-column grid:
- **Header (Cols 1–12):** Clean title ("Threads Insight Pipeline"), brief subtitle, status badge.
- **Input Section (Cols 1–12 or split 4/8 when active):**
  - Textarea for raw scraped data with character/post counter.
  - Action bar: "Load Sample Scraped Data", "Clear", and primary "Extract & Transform" action button.
  - Inline error alert container placed above the action buttons.
- **Analytics Overview (Cols 1–12):**
  - Metric cards for Total Posts Processed and PII Stripped confirmation.
  - Category / Topic Distribution bar/card breakdown.
  - Demographic Distribution cards (Age Group and Gender breakdowns, plus an "Unspecified Outliers" counter badge).
- **Output Inspection (Cols 1–12):**
  - Tabbed or split view: **Clean Records Table** and **Raw Validated JSON** (with syntax highlighting and Copy button).

## Look and Feel
- **Style:** Clean, rigid, minimalist dashboard inspired by `shadcn/ui`.
- **Palette:** Neutral, high-contrast palette (slate/zinc background, subtle borders, crisp dark/light styling).
- **Typography:** Modern, clean sans-serif (Inter / system font stack) with monospace accents for JSON output.
- **Icons & Embellishments:** Strict **no-emoji** policy. Lucide/SVG icons only for functional elements (copy, refresh, alert, check).
- **Tone:** Professional, objective data engineering tool.

## Features and Behavior

### 1. Data Ingestion & Sanitization
Source: `scope.md > The Core Loop`, `scope.md > The Unique Kernel`.
- Allows pasting arbitrary raw Threads text blocks.
- One-click sample loader pre-populates realistic messy posts (with hashtags, mentions, slang, informal banter).
- Cleans and strips personal identifying information (PII) such as usernames, handles, emails, and direct phone/contact references.

### 2. Category & Topic Classification
Source: `scope.md > The Unique Kernel`.
- Categorizes each post into a defined taxonomy (e.g., Politics, Sports, Tech, Business, Entertainment, Lifestyle).
- Aggregates posts to calculate proportional distribution percentages.

### 3. Demographic Inference & Outlier Handling
Source: `scope.md > The Unique Kernel`, user clarification.
- Evaluates linguistic cues for demographic signals: **Age Group** (e.g. Gen Z / Youth, Millennial / Young Adult, Mature Adult) and **Gender**.
- If a post lacks sufficient demographic context, it is labeled `"Unspecified"`.
- `"Unspecified"` posts are isolated as outliers and excluded from the main percentage denominator to avoid skewing recognized demographic distributions, displayed alongside as an informative outlier badge.

### 4. Schema-Validated JSON Output
Source: `scope.md > What "Working" Looks Like`.
- Produces clean, typed JSON conforming to an explicit schema.
- Includes a copy-to-clipboard button with visual confirmation toast/icon state.

## States and Boundaries

- **Empty State (First Arrival):** Input area is empty, results section shows an unobtrusive placeholder guiding the analyst to paste text or click "Load Sample Scraped Data".
- **Client Error State:** Submitting empty or whitespace-only input immediately surfaces an inline alert message without hitting backend services.
- **Processing State:** Primary button is disabled with a loading spinner; results section displays skeleton placeholders.
- **Success State:** Full grid populates with summary metric cards, percentage bars, record list, and JSON panel.
- **Service Failure State:** If backend extraction fails or times out, an inline destructive alert appears with a clear explanation and a "Retry" button; original input is preserved.

## Product Decisions
- **12-Column Grid:** Chosen for strict visual hierarchy and scalability across screen sizes.
- **Backend Computation:** Heavy lifting (LLM extraction and metrics aggregation) runs server-side, keeping client bundle lightweight and UI responsive.
- **Outlier Demographics:** Unspecified age/gender signals are excluded from the main percentage calculation to maintain analytical integrity while displaying an outlier count.
- **No Emojis:** UI restricted strictly to clean functional icons to maintain a rigid, minimalist enterprise aesthetic.
- **One-Click Sample Data:** Built-in to make demo walkthroughs fast, friction-free, and repeatable in under 60 seconds.

## What We're Building
- Single-page 12-column analytics dashboard.
- Realistic scraped Threads sample loader.
- Pre-request inline validation and error messaging.
- Backend pipeline for PII stripping, category classification, and age/gender inference.
- Outlier filtering for unspecified demographic signals.
- Metric cards showing category and demographic percentage breakdowns.
- Sanitized record table and validated JSON viewer with copy functionality.

## Deferred From the POC
- Direct live Meta Threads web scraping (out for POC; avoids login walls and brittle scraping).
- CSV/Parquet file export (out for POC; JSON copy provides direct integration).
- Custom taxonomy configuration (predefined standard categories used for POC).
- Historical persistent database storage between browser refreshes.

## Non-Goals
- Scraping authenticated Threads profiles or private accounts.
- Individual user profiling or tracking over time (strictly aggregate and anonymized).
- Generating synthetic social media posts.

## Open Questions
- None blocking product requirements definition. Exact API provider / LLM model selection and backend structure will be determined in `4-spec`.
