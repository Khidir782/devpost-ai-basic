"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
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

  const estimatedPostCount = rawText.trim()
    ? rawText.split(/\n\s*---\s*\n/).length
    : 0;

  return (
    <Card className="col-span-12 p-6 rounded-lg border border-border bg-card shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between p-0 pb-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <FileText className="w-4 h-4 text-primary" />
          <CardTitle className="text-sm font-semibold tracking-wide uppercase">
            Raw Input Workbench
          </CardTitle>
        </div>
        <div className="flex items-center space-x-3 text-xs font-mono text-muted-foreground">
          <span>{rawText.length.toLocaleString()} chars</span>
          <span>•</span>
          <span>{estimatedPostCount} posts</span>
        </div>
      </CardHeader>

      <CardContent className="p-0 pt-4 flex flex-col gap-4">
        {/* Inline Client-Side Error Alert */}
        {errorMessage && (
          <Alert variant="destructive" className="rounded-lg border-destructive/50">
            <AlertCircle className="w-4 h-4 text-destructive" />
            <AlertDescription className="text-xs">
              {errorMessage}
            </AlertDescription>
          </Alert>
        )}

        {/* Textarea */}
        <div className="flex flex-col gap-4">
          <Textarea
            id="raw-threads-input"
            value={rawText}
            onChange={handleTextChange}
            placeholder="Paste raw scraped Threads data, or click 'Load Sample Data' below to test..."
            disabled={isLoading}
            className="rounded-lg border border-input font-mono text-xs"
          />
        </div>
      </CardContent>

      <CardFooter className="flex flex-wrap items-center justify-between p-0 pt-4">
        <div className="flex items-center space-x-2">
          <Button
            type="button"
            id="load-sample-btn"
            variant="outline"
            onClick={handleLoadSample}
            disabled={isLoading}
            className="rounded-lg border-border"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Load Sample Data
          </Button>

          {rawText.length > 0 && (
            <Button
              type="button"
              id="clear-btn"
              variant="ghost"
              onClick={handleClear}
              disabled={isLoading}
              className="rounded-lg text-muted-foreground hover:text-foreground"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              Clear
            </Button>
          )}
        </div>

        <Button
          type="button"
          id="extract-submit-btn"
          variant="default"
          onClick={onSubmit}
          disabled={isLoading}
          className="rounded-lg"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 mr-2" />
              Extract &amp; Transform
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
