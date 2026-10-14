# Threads Insight Pipeline

An AI-powered extraction pipeline that transforms raw, scraped Meta Threads posts into privacy-safe, structured analyst records with instant category and demographic percentage breakdowns.

Built for the **Devpost Learn: Build With AI Basics** hackathon.

---

## Features
- **Privacy-First Sanitization:** Automatically detects and purges personally identifiable information (PII) including @handles, emails, phone numbers, and direct user identifiers.
- **Thematic Categorization:** Classifies noisy social posts into structured categories (`Sports`, `Politics`, `Tech`, `Business`, `Entertainment`, `Lifestyle`, `Other`).
- **Demographic Signal Inference with Outlier Isolation:** Infers age group and gender signals from linguistic cues while isolating ambiguous/unspecified posts as outliers, keeping aggregate percentages mathematically sound.
- **Strict Schema Validation:** Powered by Gemini 2.5 Flash and verified server-side with Zod schemas.
- **12-Column Workbench Dashboard:** Minimalist, rigid UI inspired by `shadcn/ui` with one-click sample post loading and validated JSON export with clipboard copy.

---

## Getting Started

### Prerequisites
- Node.js v18 or higher
- npm v9 or higher

### Installation
```bash
# Clone the repository
git clone https://github.com/Khidir782/devpost-ai-basic.git
cd devpost-ai-basic

# Install dependencies
npm install
```

### Environment Configuration (Optional)
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Add your Google Gemini API Key from [Google AI Studio](https://aistudio.google.com/):
```env
GEMINI_API_KEY=your_actual_gemini_api_key
```
*(Note: If no API key is provided, the application runs a built-in heuristic engine that accurately processes the curated sample Threads posts).*

### Run Locally
```bash
# Development mode
npm run dev

# Or production build
npm run build
npm run start
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Planning & Architecture Artifacts
This project followed a strict plan-first, spec-driven development methodology:
- [Scope Document](devpost/scope.md) — Core idea, unique kernel, and PoC boundary.
- [Product Requirements (PRD)](devpost/prd.md) — User journey, features, states, and acceptance criteria.
- [Technical Specification](devpost/spec.md) — Architecture, components, data model, and failure modes.
- [Build Checklist](devpost/checklist.md) — Ordered slices with mechanical verifications and commits.
- [Standalone App Map](devpost/app-map.html) — Interactive architectural reference and reusable practices.
