"use client";

import React from "react";
import { Sparkles, RefreshCw, Trash2, AlertCircle, FileText } from "lucide-react";
import { SAMPLE_THREADS_RAW_TEXT } from "@/data/sampleThreadsData";

interface InputWorkbenchProps {
  rawText: string;
  setRawText: (text: string) => void;
  isLoading: boolean;
  onSubmit: () => void;
  errorMessage: string | null;
  setErrorMessage: (msg: string | null) => void;
}

export const InputWorkbench: React.FC<InputWorkbenchProps> = ({
  rawText,
  setRawText,
  isLoading,
  onSubmit,
  errorMessage,
  setErrorMessage,
}) => {
  const handleLoadSample = () => {
    setRawText(SAMPLE_THREADS_RAW_TEXT);
    setErrorMessage(null);
  };

  const handleClear = () => {
    setRawText("");
    setErrorMessage(null);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRawText(e.target.value);
    if (errorMessage && e.target.value.trim().length > 0) {
      setErrorMessage(null);
    }
  };

  // Approximate post count by counting separator "---" or chunks
  const estimatedPostCount = rawText.trim()
    ? rawText.split(/\n\s*---\s*\n/).length
    : 0;

  return (
    <div className="col-span-12 rounded-lg border border-slate-800 bg-slate-900/60 p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 gap-2 border-b border-slate-800/80 mb-4">
        <div className="flex items-center space-x-2">
          <FileText className="w-4 h-4 text-sky-400" />
          <h2 className="text-sm font-medium text-slate-200">
            Raw Scraped Input Workbench
          </h2>
        </div>
        <div className="flex items-center space-x-3 text-xs font-mono text-slate-400">
          <span>{rawText.length.toLocaleString()} chars</span>
          <span>•</span>
          <span>{estimatedPostCount} post blocks</span>
        </div>
      </div>

      {/* Inline Client-Side Error Alert */}
      {errorMessage && (
        <div className="mb-4 flex items-center space-x-2.5 rounded-md border border-rose-800/80 bg-rose-950/40 p-3 text-xs text-rose-300">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <div className="flex-1 font-medium">{errorMessage}</div>
        </div>
      )}

      {/* Raw Textarea */}
      <div className="relative">
        <textarea
          id="raw-threads-input"
          value={rawText}
          onChange={handleTextChange}
          placeholder="Paste raw scraped Threads data (posts with hashtags, mentions, informal slang), or click 'Load Sample Scraped Data' below to test..."
          rows={9}
          disabled={isLoading}
          className="w-full resize-y rounded-md border border-slate-800 bg-slate-950/80 p-3.5 font-mono text-xs text-slate-200 placeholder-slate-500 focus:border-sky-500/80 focus:outline-none focus:ring-1 focus:ring-sky-500/50 disabled:opacity-50"
        />
      </div>

      {/* Action Bar */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            id="load-sample-btn"
            onClick={handleLoadSample}
            disabled={isLoading}
            className="inline-flex items-center space-x-1.5 rounded-md border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700/80 hover:text-white transition disabled:opacity-50"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Load Sample Scraped Data</span>
          </button>
          {rawText.length > 0 && (
            <button
              type="button"
              id="clear-btn"
              onClick={handleClear}
              disabled={isLoading}
              className="inline-flex items-center space-x-1.5 rounded-md border border-slate-800 px-3 py-1.5 text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>

        <button
          type="button"
          id="extract-submit-btn"
          onClick={onSubmit}
          disabled={isLoading}
          className="inline-flex items-center space-x-2 rounded-md bg-sky-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/50 transition disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Sanitizing & Extracting...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Extract & Transform</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
