"use client";

import React, { useState } from "react";
import { ExtractionResponse } from "@/lib/schemas";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
    <Card className="col-span-12 p-6 rounded-lg border border-border bg-card shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between p-0 pb-4 border-b border-border mb-4">
        <div className="flex items-center space-x-2">
          <Code2 className="w-4 h-4 text-primary" />
          <CardTitle className="text-sm font-semibold tracking-wide uppercase">
            Validated JSON Output
          </CardTitle>
        </div>

        <Button
          type="button"
          id="copy-json-btn"
          size="sm"
          variant="outline"
          onClick={handleCopy}
          className="h-8 px-3 text-xs font-mono rounded-lg"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 mr-1.5 text-primary" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
              <span>Copy JSON</span>
            </>
          )}
        </Button>
      </CardHeader>

      <CardContent className="p-0">
        <div className="relative rounded-lg border border-border bg-background/80 p-4 font-mono text-xs text-muted-foreground max-h-72 overflow-auto">
          <pre>{jsonString}</pre>
        </div>
      </CardContent>
    </Card>
  );
};
