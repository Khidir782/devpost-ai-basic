"use client";

import React, { useState } from "react";
import { ExtractionResponse } from "@/lib/schemas";
import { Code2, Copy, Check } from "lucide-react";

interface JsonOutputViewerProps {
  data: ExtractionResponse | null;
}

export const JsonOutputViewer: React.FC<JsonOutputViewerProps> = ({ data }) => {
  const [copied, setCopied] = useState(false);

  if (!data) return null;

  const jsonString = JSON.stringify(data, null, 2);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="col-span-12 rounded-lg border border-slate-800 bg-slate-900/60 p-5">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-3">
        <div className="flex items-center space-x-2">
          <Code2 className="w-4 h-4 text-sky-400" />
          <h3 className="text-sm font-semibold text-slate-200">
            Validated Schema-Compliant JSON
          </h3>
        </div>

        <button
          type="button"
          id="copy-json-btn"
          onClick={handleCopy}
          className="inline-flex items-center space-x-1.5 rounded-md border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-mono font-medium text-slate-200 hover:bg-slate-700 hover:text-white transition"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy JSON</span>
            </>
          )}
        </button>
      </div>

      <div className="relative rounded-md border border-slate-800 bg-slate-950 p-4 font-mono text-[11px] text-slate-300 max-h-80 overflow-auto">
        <pre>{jsonString}</pre>
      </div>
    </div>
  );
};
