"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { InputWorkbench } from "@/components/InputWorkbench";
import { AnalyticsOverview } from "@/components/AnalyticsOverview";
import { SanitizedRecordsTable } from "@/components/SanitizedRecordsTable";
import { JsonOutputViewer } from "@/components/JsonOutputViewer";
import { ExtractionResponse } from "@/lib/schemas";
import { BarChart3, Database } from "lucide-react";

export default function Home() {
  const [rawText, setRawText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resultData, setResultData] = useState<ExtractionResponse | null>(null);

  const handleExtract = async () => {
    // Client-side pre-validation: Catch empty input before hitting backend services
    if (!rawText || rawText.trim().length === 0) {
      setErrorMessage(
        "Input cannot be empty. Please paste raw scraped Threads text or click 'Load Sample Scraped Data' to test."
      );
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawText }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to process Threads data.");
      }

      setResultData(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#090d16] text-slate-100 pb-20">
      <div className="grid grid-cols-12 gap-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        {/* Header - Cols 1–12 */}
        <Header />

        {/* Input Workbench - Cols 1–12 */}
        <InputWorkbench
          rawText={rawText}
          setRawText={setRawText}
          isLoading={isLoading}
          onSubmit={handleExtract}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />

        {/* Analytics Section - Cols 1–12 */}
        <AnalyticsOverview
          metrics={resultData ? resultData.metrics : null}
          isLoading={isLoading}
        />

        {/* Detailed Results (Sanitized Records & JSON Viewer) - Cols 1–12 */}
        {resultData && !isLoading && (
          <>
            <SanitizedRecordsTable posts={resultData.posts} />
            <JsonOutputViewer data={resultData} />
          </>
        )}

        {/* Empty State placeholder if not yet extracted and not loading */}
        {!resultData && !isLoading && (
          <div className="col-span-12 rounded-lg border border-dashed border-slate-800 bg-slate-900/30 p-8 text-center">
            <div className="mx-auto max-w-md flex flex-col items-center">
              <div className="p-3 rounded-full bg-slate-800/60 border border-slate-700/60 text-slate-400 mb-3">
                <BarChart3 className="w-6 h-6 text-sky-400" />
              </div>
              <h3 className="text-sm font-semibold text-slate-200 mb-1">
                Analytics & Structured Output Surface
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Click &quot;Load Sample Scraped Data&quot; and &quot;Extract &amp; Transform&quot; to see category percentages, demographic outlier isolation, sanitized records, and copyable JSON populate on this 12-column grid.
              </p>
              <div className="mt-4 flex items-center space-x-2 text-[11px] font-mono text-slate-500">
                <Database className="w-3.5 h-3.5 text-slate-400" />
                <span>Ready for input transformation</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
