"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { InputWorkbench } from "@/components/InputWorkbench";
import { AnalyticsOverview } from "@/components/AnalyticsOverview";
import { SanitizedRecordsTable } from "@/components/SanitizedRecordsTable";
import { JsonOutputViewer } from "@/components/JsonOutputViewer";
import { ExtractionResponse } from "@/lib/schemas";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, ArrowRight } from "lucide-react";

export default function Home() {
  const [rawText, setRawText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resultData, setResultData] = useState<ExtractionResponse | null>(null);

  const handleExtract = async () => {
    // Client-side pre-validation: Catch empty input before hitting backend services
    if (!rawText || rawText.trim().length === 0) {
      setErrorMessage(
        "Input cannot be empty. Please paste raw scraped Threads text or click 'Load Sample Data' to test."
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
    <main className="min-h-screen bg-background text-foreground">
      {/* Page sections get py-12 */}
      <section className="py-12">
        <div className="grid grid-cols-12 gap-5 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header - Cols 1–12 */}
          <Header engine={resultData?.engine} />

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

          {/* Detailed Results (Records & JSON Viewer) - Cols 1–12 */}
          {resultData && !isLoading && (
            <>
              <SanitizedRecordsTable posts={resultData.posts} />
              <JsonOutputViewer data={resultData} />
            </>
          )}

          {/* Empty State placeholder if not yet extracted and not loading */}
          {!resultData && !isLoading && (
            <Card className="col-span-12 p-6 rounded-lg border border-dashed border-border bg-card text-center shadow-sm">
              <CardContent className="p-0 py-8 max-w-sm mx-auto flex flex-col items-center">
                <div className="w-10 h-10 rounded-lg bg-secondary border border-border flex items-center justify-center text-primary mb-3">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-1">
                  Analytics Ready
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Click &ldquo;Load Sample Data&rdquo; and &ldquo;Extract &amp; Transform&rdquo; to populate topic metrics and demographic distributions.
                </p>
                <div className="mt-4 flex items-center space-x-1.5 text-xs font-mono text-muted-foreground">
                  <span>Awaiting input</span>
                  <ArrowRight className="w-3.5 h-3.5 text-primary" />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </main>
  );
}
