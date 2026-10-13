---
doc: scope
status: approved
---

# Threads Insight Pipeline

An AI-powered extraction pipeline that turns raw, scraped Meta Threads posts into privacy-safe, structured analyst records with instant category and demographic percentage breakdowns.

## The Unique Kernel
Privacy-first automated transformation: sanitizing raw scraped social text by stripping personal identifiers (PII), classifying posts into clear thematic categories (sports, politics, etc.), and inferring high-level demographic distributions (age group and gender) to give analysts instant aggregate statistics and clean schema-validated records.

## Who It's For
A data analyst working with social media intelligence who needs structured, categorized Threads data for research or dashboards, but currently wastes hours wrangling messy slang, emojis, hashtags, and privacy liabilities in raw scraped dumps.

## The Core Loop
1. The analyst pastes or uploads raw scraped Threads text or JSON snippets.
2. The pipeline strips PII, tags categories (politics, sports, etc.), and estimates high-level demographic signals (age group and gender).
3. The system validates the output schema and renders an immediate percentage distribution alongside clean, exportable JSON.

## Inspiration & Identity
Crisp, analytical data workbench feel: minimalist, high-contrast, with clear visual percentage cards and a readable raw-vs-structured JSON view.

## Why This Matters to the Learner
Provides hands-on experience building an end-to-end AI extraction and transformation pipeline—mastering prompt-to-schema reliability, data sanitization, and output validation on notoriously chaotic real-world inputs.

## What "Working" Looks Like
In a 1-minute demo: pasting a sample batch of raw, unstructured Threads posts (with slang, hashtags, and messy text), running the pipeline, and watching it produce:
- A clear visual summary showing category percentages (e.g., 40% Sports, 35% Politics) and demographic splits (age group & gender).
- A schema-validated JSON payload ready for downstream analytics with all personal identifiers removed.

## The POC Boundary
- **Input:** Pasting or loading sample raw scraped Threads posts.
- **Processing:** AI extraction with strict PII removal, topic classification, and demographic inference (age group & gender).
- **Validation & Output:** Schema validation ensuring consistent JSON fields, paired with an on-screen percentage distribution summary.

## Later
- Direct live-scraping integration with Meta Threads.
- Batch file export (CSV, Parquet, or direct database sync).
- Multi-platform adapters (e.g., Reddit, Bluesky, X).

## Explicitly Cut
- Scraping behind login or authentication walls (too brittle and high-overhead for a POC).
- Storing or exposing individual personal identifiers (usernames, profile links, personal contact info).
