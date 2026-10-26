import React, { useState } from "react";
import { ExtractedPost } from "@/lib/schemas";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, Filter } from "lucide-react";

interface SanitizedRecordsTableProps {
  posts: ExtractedPost[];
}

export const SanitizedRecordsTable: React.FC<SanitizedRecordsTableProps> = ({ posts }) => {
  const [categoryFilter, setCategoryFilter] = useState<string>("All");

  const categories = ["All", ...Array.from(new Set(posts.map((p) => p.category)))];

  const filteredPosts =
    categoryFilter === "All"
      ? posts
      : posts.filter((p) => p.category === categoryFilter);

  return (
    <Card className="col-span-12 p-6 rounded-lg border border-border bg-card shadow-sm">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-0 pb-4 border-b border-border mb-4 gap-3">
        <div className="flex items-center space-x-2">
          <Table className="w-4 h-4 text-primary" />
          <CardTitle className="text-sm font-semibold tracking-wide uppercase">
            Thread Records
          </CardTitle>
          <span className="text-xs font-mono text-muted-foreground">
            ({filteredPosts.length} of {posts.length})
          </span>
        </div>

        {/* Category Filter Pills using Shadcn Button */}
        <div className="flex items-center space-x-2">
          <Filter className="w-3.5 h-3.5 text-muted-foreground" />
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <Button
                key={cat}
                type="button"
                size="sm"
                variant={categoryFilter === cat ? "default" : "outline"}
                onClick={() => setCategoryFilter(cat)}
                className="h-7 px-2.5 text-xs font-mono rounded-lg"
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>

      {/* Records List */}
      <CardContent className="p-0 space-y-3 max-h-[480px] overflow-y-auto pr-1">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="rounded-lg border border-border bg-background/60 p-4 space-y-2 transition-colors hover:border-primary/50"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono text-muted-foreground">
                  #{post.id}
                </span>
                <Badge variant="secondary" className="text-[10px]">
                  {post.category}
                </Badge>
              </div>

              <div className="flex items-center space-x-3 text-xs font-mono text-muted-foreground">
                <span>
                  Age: <span className="text-foreground">{post.demographics.ageGroup}</span>
                </span>
                <span className="opacity-40">•</span>
                <span>
                  Gender: <span className="text-foreground">{post.demographics.gender}</span>
                </span>
              </div>
            </div>

            <p className="text-xs text-foreground leading-relaxed whitespace-pre-wrap font-sans">
              {post.sanitizedText}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
