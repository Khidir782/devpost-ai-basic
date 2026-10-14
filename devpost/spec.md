---
doc: spec
status: approved
---

# Threads Insight Pipeline — Technical Spec

## How This Works, In Plain Language
The system is a single full-stack Next.js web application running locally. When an analyst pastes raw scraped Threads posts into the browser (or clicks the sample data button), the client first checks that the input is valid and non-empty. 

When the user submits, the browser sends the text payload to a server-side API route (`/api/extract`). This backend route contacts Google Gemini 2.5 Flash using structured output mode. The model strips personal identifying information (PII), tags each post with a topic category, and infers age group and gender signals (tagging ambiguous posts as `"Unspecified"`). 

The backend validates the resulting JSON against a strict Zod schema, calculates category percentages and demographic percentage distributions (excluding `"Unspecified"` outliers from the denominator while recording their count), and returns the complete analytical payload to the browser. The browser renders the 12-column dashboard: metric cards, percentage distribution bars, sanitized records, and an interactive copyable JSON viewer.

## The Core Journey Through the System
1. **User lands on `http://localhost:3000`:** Next.js serves the single-page workbench. The input textarea is empty and action buttons are enabled. *(Implements `prd.md > The Core Journey` Step 1)*
2. **User loads or pastes data:** Clicking "Load Sample Scraped Data" sets realistic mock Threads posts in component state, or the user pastes their own raw scraped text. *(Implements `prd.md > The Core Journey` Step 2)*
3. **Client-side pre-validation:** The user clicks "Extract & Transform". The form handler checks for non-empty text. If blank, an inline error alert displays immediately without firing an API request. *(Implements `prd.md > The Core Journey` Step 3)*
4. **API invocation:** If valid, the client sends a `POST /api/extract` request with `{ rawText: string }`. The UI activates a loading state (spinner on button, skeleton placeholders in the results section). *(Implements `prd.md > The Core Journey` Step 4)*
5. **Server-side extraction & validation:**
   - The route handler invokes Gemini 2.5 Flash with structured schema instructions.
   - PII is excised from all post texts.
   - The response is parsed and validated using Zod.
   - The route aggregates topic category counts and demographic percentages (excluding `"Unspecified"` from the base percentage and tallying outlier count).
6. **Results rendering:** The client receives the JSON response and renders the 12-column grid with summary cards, percentage bars, records table, and raw JSON panel with a copy button. *(Implements `prd.md > The Core Journey` Step 5)*

## Stack
- **Framework:** Next.js (App Router, TypeScript) — unified single-project repository providing client UI and serverless Route Handlers in one dev server.
- **Styling & UI:** Tailwind CSS, shadcn/ui-inspired primitives, Lucide React icons — clean, rigid minimalist aesthetic with strict no-emoji policy.
- **AI SDK:** `@google/genai` (or `@google/generative-ai`) calling `gemini-2.5-flash` with structured JSON schema output — high-speed, cost-effective, deterministic schema output.
- **Data Validation:** Zod — ensures runtime type safety and strict schema contracts between LLM output and frontend components.
- **Runtime:** Node.js (v18+) on macOS / local environment.

### Dependency Documentation Links
- Next.js: https://nextjs.org/docs
- Google Gen AI SDK: https://ai.google.dev/gemini-api/docs
- Zod: https://zod.dev
- Lucide React: https://lucide.dev

## Where It Runs and How Someone Tries It
- **Runtime Environment:** Runs as a local development server on Node.js.
- **Environment Variables:** Requires `GEMINI_API_KEY` stored in `.env.local` (kept out of Git by `.gitignore`).
- **Start Command:**
  ```bash
  npm run dev
  ```
- **Demo Recording Target:** Open `http://localhost:3000` in a browser. For the hackathon submission, record a 60-second screen capture showing:
  1. Opening the dashboard.
  2. Clicking "Load Sample Scraped Data" to populate messy Threads posts.
  3. Clicking "Extract & Transform" and watching the skeleton state transition.
  4. Reviewing the category breakdown, demographic distribution (with outlier counter), and clicking "Copy JSON".
- **Deployment:** None required for POC submission; public GitHub repository and video link are sufficient.

## Look and Feel
Carried forward from `prd.md > Look and Feel`:
- **Palette:** Zinc/slate neutral palette (`bg-slate-950` / `text-slate-100` dark mode, or crisp high-contrast slate light mode) with subtle borders (`border-slate-800`).
- **Typography:** Inter or system sans-serif font stack; monospace (`font-mono`) for raw text and JSON code viewer.
- **Icons:** Lucide React icons only (e.g. `Copy`, `Check`, `Sparkles`, `RefreshCw`, `AlertCircle`). Strictly no emojis.
- **Density:** Compact, rigid 12-column dashboard layout with tight padding, high data density, and clear information hierarchy.

## Components

### `Header`
- **Purpose:** Displays app title, version badge ("POC v1.0"), and status indicator.
- **Connects to:** Top of page layout (Cols 1–12).
- **PRD ref:** Implements `prd.md > Screens and Layout (Header)`.

### `InputWorkbench`
- **Purpose:** Houses the textarea for raw scraped text, character/post counter, "Load Sample Scraped Data" button, "Clear" button, primary "Extract & Transform" button, and inline validation alert banner.
- **Connects to:** Page state (`rawText`, `isLoading`, `error`).
- **PRD ref:** Implements `prd.md > Features and Behavior (Data Ingestion & Sanitization)` and `prd.md > States and Boundaries (Client Error State)`.

### `AnalyticsOverview`
- **Purpose:** Renders summary analytical metric cards: Total Posts Processed, PII Scrubbed badge, Category Distribution bars, and Demographic Split (Age Group & Gender) with an "Unspecified Outliers" badge.
- **Connects to:** Processed analytics data object returned from the API.
- **PRD ref:** Implements `prd.md > Features and Behavior (Category & Topic Classification, Demographic Inference & Outlier Handling)`.

### `SanitizedRecordsTable`
- **Purpose:** Displays an interactive list or table of sanitized posts showing sanitized text, category tag, and inferred demographics without any PII.
- **Connects to:** Extracted posts array from the API response.
- **PRD ref:** Implements `prd.md > Features and Behavior (Data Ingestion & Sanitization)`.

### `JsonOutputViewer`
- **Purpose:** Displays syntax-highlighted, formatted JSON output of the entire extraction payload with a 1-click "Copy JSON" button and visual copy feedback.
- **Connects to:** Full JSON response object.
- **PRD ref:** Implements `prd.md > Features and Behavior (Schema-Validated JSON Output)`.

### `api/extract/route.ts`
- **Purpose:** Next.js Route Handler that receives `{ rawText }`, calls Gemini 2.5 Flash with structured output schemas, executes Zod validation, calculates aggregate percentages and outlier counts, and returns the response.
- **Connects to:** Google Gemini API and client fetch requests.
- **PRD ref:** Implements `prd.md > Features and Behavior (All backend features)`.

## Data Model

### TypeScript / Zod Schemas

```typescript
// Single Extracted Post Schema
export interface ExtractedPost {
  id: string;
  sanitizedText: string;
  category: 'Sports' | 'Politics' | 'Tech' | 'Business' | 'Entertainment' | 'Lifestyle' | 'Other';
  demographics: {
    ageGroup: 'Gen Z / Youth' | 'Millennial / Young Adult' | 'Mature Adult' | 'Unspecified';
    gender: 'Male' | 'Female' | 'Non-Binary' | 'Unspecified';
  };
}

// Summary Metrics Schema
export interface PipelineMetrics {
  totalPosts: number;
  piiScrubbedCount: number;
  categoryDistribution: Record<string, { count: number; percentage: number }>;
  demographicDistribution: {
    ageGroup: Record<string, { count: number; percentage: number }>;
    gender: Record<string, { count: number; percentage: number }>;
    unspecifiedOutliers: {
      ageCount: number;
      genderCount: number;
    };
  };
}

// Complete API Response Payload
export interface ExtractionResponse {
  success: boolean;
  metrics: PipelineMetrics;
  posts: ExtractedPost[];
}
```

### State Storage & Lifecycle
- **Client State:** Kept in React state (`useState`) during the active session. If the user refreshes, the app returns to its clean initial empty state.
- **Server State:** Stateless API route. No persistent database required for POC.

## File Structure

```
devpost-ai-basic/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── extract/
│   │   │       └── route.ts          # Server-side Gemini extraction & Zod validation
│   │   ├── globals.css               # Tailwind CSS & theme tokens
│   │   ├── layout.tsx                # Root layout & typography
│   │   └── page.tsx                  # 12-column grid workbench dashboard
│   ├── components/
│   │   ├── Header.tsx                # Dashboard header & status badge
│   │   ├── InputWorkbench.tsx        # Textarea, sample loader, inline alert, actions
│   │   ├── AnalyticsOverview.tsx     # Percentage metric cards & outlier badges
│   │   ├── SanitizedRecordsTable.tsx # PII-free records list
│   │   └── JsonOutputViewer.tsx      # Code viewer with copy-to-clipboard button
│   ├── data/
│   │   └── sampleThreadsData.ts      # Curated realistic raw scraped Threads posts
│   └── lib/
│       ├── gemini.ts                 # Gemini API client & prompt configuration
│       ├── metrics.ts                # Percentage calculations & outlier math
│       └── schemas.ts                # Zod schemas & TypeScript types
├── devpost/                          # Hackathon planning artifacts
│   ├── learner-profile.md
│   ├── scope.md
│   ├── prd.md
│   └── spec.md
├── .env.example                      # Template for GEMINI_API_KEY
├── .gitignore                        # Git ignore rules
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

## External Services and Dependencies
- **Service:** Google Gemini API (`gemini-2.5-flash`).
- **Call Details:** Generates content via `@google/genai` with `responseMimeType: "application/json"` and structured JSON schema.
- **Key Requirement:** `GEMINI_API_KEY` environment variable.
- **Rate Limits & Cost:** Gemini 2.5 Flash has a free-tier rate limit (15 RPM / 1M TPM) more than sufficient for local testing and demo recording.

## Important Failure Modes
1. **Empty or Whitespace Input:** 
   - *Failure:* User clicks submit without text.
   - *Fallback:* Caught instantly client-side; displays an inline warning banner above the button. No network request made.
2. **Missing or Invalid Gemini API Key:**
   - *Failure:* API call returns 401/403 or throws configuration error.
   - *Fallback:* Route handler catches error and returns `{ success: false, error: "Gemini API key is missing or invalid. Check .env.local." }`. UI displays an inline destructive alert with actionable setup instructions.
3. **Model Parsing or Timeout Error:**
   - *Failure:* LLM fails to output parseable schema or takes too long.
   - *Fallback:* Route handler catches exception, returns clean 500 error; UI shows an inline error alert with a "Retry" button, keeping the user's raw input intact in the textarea.

## What Was Simplified and Why
- **Local Dev Server instead of Cloud Deployment:** Simplifies environment management and eliminates hosting setup friction; running locally is 100% compliant with hackathon submission requirements.
- **Curated Sample Dataset instead of Live Web Scraping:** Pre-seeded realistic messy Threads posts avoid fragile scraping scripts, IP bans, and Meta login walls while proving the core transformation value.
- **In-Memory React State instead of PostgreSQL/Database:** The core objective is proving the extraction pipeline and analytics calculation; session-based state keeps the codebase clean and setup-free.

## Decisions and Open Issues
- **Learner Decision:** Next.js full-stack with TypeScript (matches learner's TypeScript background; avoids managing separate frontend/backend processes).
- **Learner Decision:** Gemini 2.5 Flash via Gemini API (learner is experienced with Gemini / LangChain concepts; fast and native structured output).
- **Learner Decision:** Local runtime for demo recording (`http://localhost:3000`).
- **One Useful Unknown Discussed:** How to guarantee the LLM reliably produces schema-compliant JSON without hallucinated keys or broken syntax.  
  *Clarification:* We use Gemini 2.5 Flash's native structured JSON mode paired with server-side Zod `.safeParse()` validation. If the model returns any unexpected structure, Zod flags it before it reaches the frontend, ensuring complete schema predictability.
