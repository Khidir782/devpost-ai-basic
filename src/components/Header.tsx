import React from "react";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

interface HeaderProps {
  engine?: string;
}

export const Header: React.FC<HeaderProps> = ({ engine }) => {
  return (
    <header className="col-span-12 border-b border-border pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center space-x-3.5">
        <div className="w-9 h-9 rounded-lg border border-border bg-secondary flex items-center justify-center text-primary">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-base font-semibold tracking-tight text-foreground">
              Threads Insight Pipeline
            </h1>
            <Badge variant="outline" className="text-[10px] uppercase">
              POC
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Automated topic classification and demographic intelligence for social media streams
          </p>
        </div>
      </div>

      <div className="flex items-center">
        <div className="flex items-center space-x-2 px-3 py-1 rounded-lg border border-border bg-card text-xs font-mono text-muted-foreground">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span>{engine || "Gemini 2.5 Flash"}</span>
        </div>
      </div>
    </header>
  );
};

