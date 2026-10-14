import React from "react";
import { PipelineMetrics } from "@/lib/schemas";
import { BarChart3, Users, ShieldCheck, Database, AlertTriangle, Layers } from "lucide-react";

interface AnalyticsOverviewProps {
  metrics: PipelineMetrics | null;
  isLoading: boolean;
}

export const AnalyticsOverview: React.FC<AnalyticsOverviewProps> = ({
  metrics,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="col-span-12 grid grid-cols-12 gap-5 animate-pulse">
        {/* Metric Cards Skeletons */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-3 h-24 rounded-lg bg-slate-900/80 border border-slate-800" />
        <div className="col-span-12 sm:col-span-6 lg:col-span-3 h-24 rounded-lg bg-slate-900/80 border border-slate-800" />
        <div className="col-span-12 sm:col-span-6 lg:col-span-3 h-24 rounded-lg bg-slate-900/80 border border-slate-800" />
        <div className="col-span-12 sm:col-span-6 lg:col-span-3 h-24 rounded-lg bg-slate-900/80 border border-slate-800" />

        {/* Detailed Chart Skeletons */}
        <div className="col-span-12 lg:col-span-6 h-64 rounded-lg bg-slate-900/80 border border-slate-800" />
        <div className="col-span-12 lg:col-span-6 h-64 rounded-lg bg-slate-900/80 border border-slate-800" />
      </div>
    );
  }

  if (!metrics) return null;

  const categories = Object.entries(metrics.categoryDistribution).sort(
    (a, b) => b[1].percentage - a[1].percentage
  );

  const topCategory = categories[0]
    ? `${categories[0][0]} (${categories[0][1].percentage}%)`
    : "None";

  const ageGroups = Object.entries(metrics.demographicDistribution.ageGroup).sort(
    (a, b) => b[1].percentage - a[1].percentage
  );

  const genders = Object.entries(metrics.demographicDistribution.gender).sort(
    (a, b) => b[1].percentage - a[1].percentage
  );

  return (
    <div className="col-span-12 grid grid-cols-12 gap-5">
      {/* 4 Summary Stat Cards */}
      <div className="col-span-12 sm:col-span-6 lg:col-span-3 rounded-lg border border-slate-800 bg-slate-900/70 p-4">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-medium uppercase tracking-wider">Total Ingested</span>
          <Database className="w-4 h-4 text-sky-400" />
        </div>
        <div className="text-2xl font-bold font-mono text-slate-100">
          {metrics.totalPosts}
        </div>
        <div className="mt-1 text-[11px] text-slate-400">
          Cleaned social records
        </div>
      </div>

      <div className="col-span-12 sm:col-span-6 lg:col-span-3 rounded-lg border border-slate-800 bg-slate-900/70 p-4">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-medium uppercase tracking-wider">PII Sanitized</span>
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="text-2xl font-bold font-mono text-emerald-400">
          {metrics.piiScrubbedCount} / {metrics.totalPosts}
        </div>
        <div className="mt-1 text-[11px] text-slate-400">
          Handles & emails purged
        </div>
      </div>

      <div className="col-span-12 sm:col-span-6 lg:col-span-3 rounded-lg border border-slate-800 bg-slate-900/70 p-4">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-medium uppercase tracking-wider">Dominant Topic</span>
          <Layers className="w-4 h-4 text-indigo-400" />
        </div>
        <div className="text-lg font-bold font-mono text-indigo-300 truncate">
          {topCategory}
        </div>
        <div className="mt-1 text-[11px] text-slate-400">
          Highest frequency cluster
        </div>
      </div>

      <div className="col-span-12 sm:col-span-6 lg:col-span-3 rounded-lg border border-slate-800 bg-slate-900/70 p-4">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-medium uppercase tracking-wider">Outliers (Unspecified)</span>
          <AlertTriangle className="w-4 h-4 text-amber-400" />
        </div>
        <div className="text-2xl font-bold font-mono text-amber-300">
          {metrics.demographicDistribution.unspecifiedOutliers.ageCount}
        </div>
        <div className="mt-1 text-[11px] text-slate-400">
          Excluded from demographic base
        </div>
      </div>

      {/* Category Breakdown (Cols 1–6) */}
      <div className="col-span-12 lg:col-span-6 rounded-lg border border-slate-800 bg-slate-900/60 p-5">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-semibold text-slate-200">
              Topic & Category Distribution
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {categories.length} categories
          </span>
        </div>

        <div className="space-y-3.5">
          {categories.map(([category, data]) => (
            <div key={category}>
              <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
                <span className="text-slate-300 font-medium">{category}</span>
                <span className="text-slate-400">
                  {data.percentage}% ({data.count})
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-sky-500 transition-all duration-500"
                  style={{ width: `${Math.max(data.percentage, 2)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Demographic Breakdown & Outlier Isolation (Cols 7–12) */}
      <div className="col-span-12 lg:col-span-6 rounded-lg border border-slate-800 bg-slate-900/60 p-5">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-slate-200">
              Demographic Signal Distributions
            </h3>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-950/60 border border-amber-800/60 text-amber-300">
            Outliers Isolated
          </span>
        </div>

        {/* Age Groups */}
        <div className="mb-5">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-medium text-slate-300">Age Group (Identified)</span>
            <span className="text-[11px] font-mono text-slate-400">
              {metrics.demographicDistribution.unspecifiedOutliers.ageCount} unclassified
            </span>
          </div>

          <div className="space-y-2.5">
            {ageGroups.length > 0 ? (
              ageGroups.map(([age, data]) => (
                <div key={age}>
                  <div className="flex items-center justify-between text-xs mb-1 font-mono">
                    <span className="text-slate-400">{age}</span>
                    <span className="text-slate-300">{data.percentage}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                      style={{ width: `${Math.max(data.percentage, 2)}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic">No age cues identified in dataset</p>
            )}
          </div>
        </div>

        {/* Gender Breakdown */}
        <div className="border-t border-slate-800/80 pt-4">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-medium text-slate-300">Gender Signals (Identified)</span>
            <span className="text-[11px] font-mono text-slate-400">
              {metrics.demographicDistribution.unspecifiedOutliers.genderCount} unclassified
            </span>
          </div>

          <div className="space-y-2.5">
            {genders.length > 0 ? (
              genders.map(([gender, data]) => (
                <div key={gender}>
                  <div className="flex items-center justify-between text-xs mb-1 font-mono">
                    <span className="text-slate-400">{gender}</span>
                    <span className="text-slate-300">{data.percentage}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-teal-500 transition-all duration-500"
                      style={{ width: `${Math.max(data.percentage, 2)}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic">No gender cues identified in dataset</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
