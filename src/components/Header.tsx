import React from "react";
import { ShieldCheck, Activity, Terminal } from "lucide-react";

export const Header: React.FC = () => {
  return (
    <header className="col-span-12 border-b border-slate-800/80 bg-slate-900/50 backdrop-blur px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-md bg-sky-950/60 border border-sky-800/60 text-sky-400">
          <Terminal className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-lg font-semibold tracking-tight text-slate-100">
              Threads Insight Pipeline
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded border border-slate-700 bg-slate-800/60 text-slate-300">
              POC v1.0
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Automated social data extraction, PII sanitation, and demographic percentage analytics
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-4 text-xs font-mono text-slate-400">
        <div className="flex items-center space-x-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>PII Sanitization Active</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <Activity className="w-4 h-4 text-sky-400" />
          <span>Engine: Gemini 2.5 Flash</span>
        </div>
      </div>
    </header>
  );
};
