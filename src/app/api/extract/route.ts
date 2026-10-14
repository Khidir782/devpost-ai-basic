import { NextRequest, NextResponse } from "next/server";
import { extractWithGemini } from "@/lib/gemini";
import { calculateMetrics } from "@/lib/metrics";
import { ExtractionResponse } from "@/lib/schemas";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { rawText } = body;

    if (!rawText || typeof rawText !== "string" || rawText.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing or empty rawText field in request body",
        },
        { status: 400 }
      );
    }

    // Run extraction & PII sanitization
    const posts = await extractWithGemini(rawText);

    // Calculate aggregated percentages and isolate outliers
    const metrics = calculateMetrics(posts);

    const payload: ExtractionResponse = {
      success: true,
      metrics,
      posts,
    };

    return NextResponse.json(payload, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal extraction error";
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
