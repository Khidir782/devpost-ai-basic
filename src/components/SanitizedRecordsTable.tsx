import React, { useState } from "react";
import { ExtractedPost } from "@/lib/schemas";
import { Table, ShieldCheck, Filter } from "lucide-react";

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
    <div className="col-span-12 rounded-lg border border-slate-800 bg-slate-900/60 p-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-800/80 pb-3 mb-4 gap-3">
        <div className="flex items-center space-x-2">
          <Table className="w-4 h-4 text-sky-400" />
          <h3 className="text-sm font-semibold text-slate-200">
            Sanitized Analyst Records
          </h3>
          <span className="text-xs font-mono text-slate-400">
            ({filteredPosts.length} of {posts.length})
          </span>
        </div>

        {/* Category Filter */}
        <div className="flex items-center space-x-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <div className="flex flex-wrap gap-1">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`px-2 py-1 text-[11px] font-mono rounded transition ${
                  categoryFilter === cat
                    ? "bg-sky-500 text-slate-950 font-semibold"
                    : "bg-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Records List */}
      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="rounded-md border border-slate-800/90 bg-slate-950/60 p-3.5 transition hover:border-slate-700"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-semibold text-slate-400">
                  #{post.id}
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-sky-950 border border-sky-800 text-sky-300">
                  {post.category}
                </span>
                {post.hadPii && (
                  <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-950/80 border border-emerald-800/60 text-emerald-300">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>PII Purged</span>
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2 text-[11px] font-mono text-slate-400">
                <span>Age: <strong className="text-slate-300">{post.demographics.ageGroup}</strong></span>
                <span>•</span>
                <span>Gender: <strong className="text-slate-300">{post.demographics.gender}</strong></span>
              </div>
            </div>

            <p className="text-xs text-slate-200 font-sans leading-relaxed whitespace-pre-wrap">
              {post.sanitizedText}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
