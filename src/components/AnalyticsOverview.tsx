import React from "react";
import { PipelineMetrics } from "@/lib/schemas";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Users, Database, Layers, AlertCircle } from "lucide-react";

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
        <Card className="col-span-12 sm:col-span-4 h-28 p-6 rounded-lg border border-border bg-card" />
        <Card className="col-span-12 sm:col-span-4 h-28 p-6 rounded-lg border border-border bg-card" />
        <Card className="col-span-12 sm:col-span-4 h-28 p-6 rounded-lg border border-border bg-card" />
        <Card className="col-span-12 lg:col-span-6 h-64 p-6 rounded-lg border border-border bg-card" />
        <Card className="col-span-12 lg:col-span-6 h-64 p-6 rounded-lg border border-border bg-card" />
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
      {/* 3 Summary Cards */}
      <Card className="col-span-12 sm:col-span-4 p-6 rounded-lg border border-border bg-card shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-muted-foreground mb-2">
          <span className="text-xs uppercase tracking-wider">Total Analyzed</span>
          <Database className="w-4 h-4 text-primary" />
        </div>
        <div>
          <div className="text-2xl font-semibold font-mono text-foreground">
            {metrics.totalPosts}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Processed thread records
          </p>
        </div>
      </Card>

      <Card className="col-span-12 sm:col-span-4 p-6 rounded-lg border border-border bg-card shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-muted-foreground mb-2">
          <span className="text-xs uppercase tracking-wider">Dominant Category</span>
          <Layers className="w-4 h-4 text-muted-foreground" />
        </div>
        <div>
          <div className="text-xl font-semibold font-mono text-foreground truncate">
            {topCategory}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Highest frequency cluster
          </p>
        </div>
      </Card>

      <Card className="col-span-12 sm:col-span-4 p-6 rounded-lg border border-border bg-card shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between text-muted-foreground mb-2">
          <span className="text-xs uppercase tracking-wider">Isolated Outliers</span>
          <AlertCircle className="w-4 h-4 text-primary" />
        </div>
        <div>
          <div className="text-2xl font-semibold font-mono text-primary">
            {metrics.demographicDistribution.unspecifiedOutliers.ageCount}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Unspecified posts excluded from demographic base
          </p>
        </div>
      </Card>

      {/* Category Breakdown (Cols 1–6) */}
      <Card className="col-span-12 lg:col-span-6 p-6 rounded-lg border border-border bg-card shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between p-0 pb-4 border-b border-border mb-4">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            <CardTitle className="text-sm font-semibold tracking-wide uppercase">
              Topic Distribution
            </CardTitle>
          </div>
          <Badge variant="outline" className="font-mono text-[10px]">
            {categories.length} categories
          </Badge>
        </CardHeader>

        <CardContent className="p-0 space-y-4">
          {categories.map(([category, data]) => (
            <div key={category} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-foreground">{category}</span>
                <span className="text-muted-foreground">
                  {data.percentage}% <span className="opacity-60">({data.count})</span>
                </span>
              </div>
              <Progress value={data.percentage} className="h-1.5" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Demographic Breakdown & Outlier Isolation (Cols 7–12) */}
      <Card className="col-span-12 lg:col-span-6 p-6 rounded-lg border border-border bg-card shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between p-0 pb-4 border-b border-border mb-4">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-primary" />
            <CardTitle className="text-sm font-semibold tracking-wide uppercase">
              Demographic Signals
            </CardTitle>
          </div>
          <Badge variant="secondary" className="font-mono text-[10px]">
            Outliers Excluded
          </Badge>
        </CardHeader>

        <CardContent className="p-0 space-y-5">
          {/* Age Groups */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-foreground">Age Group</span>
              <span className="font-mono text-muted-foreground text-[11px]">
                {metrics.demographicDistribution.unspecifiedOutliers.ageCount} unclassified
              </span>
            </div>

            <div className="space-y-2.5">
              {ageGroups.length > 0 ? (
                ageGroups.map(([age, data]) => (
                  <div key={age} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-muted-foreground">{age}</span>
                      <span className="text-foreground">{data.percentage}%</span>
                    </div>
                    <Progress value={data.percentage} className="h-1.5" />
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground italic">No age signals identified</p>
              )}
            </div>
          </div>

          {/* Gender Breakdown */}
          <div className="border-t border-border pt-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-foreground">Gender Signals</span>
              <span className="font-mono text-muted-foreground text-[11px]">
                {metrics.demographicDistribution.unspecifiedOutliers.genderCount} unclassified
              </span>
            </div>

            <div className="space-y-2.5">
              {genders.length > 0 ? (
                genders.map(([gender, data]) => (
                  <div key={gender} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-muted-foreground">{gender}</span>
                      <span className="text-foreground">{data.percentage}%</span>
                    </div>
                    <Progress value={data.percentage} className="h-1.5" />
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground italic">No gender signals identified</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
