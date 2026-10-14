"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { InputWorkbench } from "@/components/InputWorkbench";
import { BarChart3, Database } from "lucide-react";

export default function Home() {
  const [rawText, setRawText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleExtract = async () => {
    // Client-side pre-validation: Catch empty input before reaching backend services
    if (!rawText || rawText.trim().length === 0) {
      setErrorMessage(
        "Input cannot be empty. Please paste raw scraped Threads text or click 'Load Sample Scraped Data' to test."
      );
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    try {
      // In Slice 1, verify client validation and interactive surface.
      // Slices 2, 3, and 4 will wire up the /api/extract backend and live metrics.
      await new Promise((res) => setTimeout(res, 600));
      setErrorMessage("Backend extraction pipeline ready for connection in Slice 2.");
    } catch {
      setErrorMessage("An unexpected client error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#090d16] text-slate-100 pb-16">
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

        {/* Initial Empty / Results Placeholder Section - Cols 1–12 */}
        <div className="col-span-12 rounded-lg border border-dashed border-slate-800 bg-slate-900/30 p-8 text-center">
          <div className="mx-auto max-w-md flex flex-col items-center">
            <div className="p-3 rounded-full bg-slate-800/60 border border-slate-700/60 text-slate-400 mb-3">
              <BarChart3 className="w-6 h-6 text-sky-400" />
            </div>
            <h3 className="text-sm font-semibold text-slate-200 mb-1">
              Analytics & Structured Output Surface
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              When extraction runs, this 12-column grid populates with category breakdown bars, demographic distribution cards (with outlier separation), sanitized records, and copyable validated JSON.
            </p>
            <div className="mt-4 flex items-center space-x-2 text-[11px] font-mono text-slate-500">
              <Database className="w-3.5 h-3.5 text-slate-400" />
              <span>Awaiting input transformation</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
