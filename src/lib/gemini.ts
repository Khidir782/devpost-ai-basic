import { GoogleGenerativeAI } from "@google/generative-ai";
import { ExtractedPost, ExtractedPostSchema } from "./schemas";

// High-fidelity fallback for offline demo / when API key is pending
function generateSimulatedExtraction(rawText: string): ExtractedPost[] {
  const chunks = rawText
    .split(/\n\s*---\s*\n/)
    .map((c) => c.trim())
    .filter(Boolean);

  return chunks.map((chunk, index) => {
    const id = `post-${index + 1}`;
    const hadPii = /@[\w_]+|[\w.-]+@[\w.-]+\.\w+|\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/i.test(chunk);
    
    // Remove PII patterns
    const sanitizedText = chunk
      .replace(/\[Post #\d+[^\]]*\]:?\s*/gi, "")
      .replace(/@[\w_]+/g, "[REDACTED_USER]")
      .replace(/[\w.-]+@[\w.-]+\.\w+/g, "[REDACTED_EMAIL]")
      .replace(/\(Contact:[^)]+\)/gi, "")
      .replace(/\(ID:\s*\d+\)/gi, "")
      .trim();

    // Determine category based on keywords
    const lower = chunk.toLowerCase();
    let category: ExtractedPost["category"] = "Other";
    let ageGroup: ExtractedPost["demographics"]["ageGroup"] = "Unspecified";
    let gender: ExtractedPost["demographics"]["gender"] = "Unspecified";

    if (/llm|gpu|model|tech|developer|algorithms|silicon|code|hack/i.test(lower)) {
      category = "Tech";
      if (/dorm|no cap|fr fr|midterms/i.test(lower)) {
        ageGroup = "Gen Z / Youth";
      }
    } else if (/toddler|preschool|target|parenting|refi|mortgage|iced latte/i.test(lower)) {
      category = "Lifestyle";
      ageGroup = "Millennial / Young Adult";
      gender = "Female";
    } else if (/defense|lead|game|nba|finals|coach|coverage|pick-and-roll|hoops/i.test(lower)) {
      category = "Sports";
      gender = "Male";
    } else if (/retiring|retirement|roth ira|decades|civil engineering/i.test(lower)) {
      category = "Business";
      ageGroup = "Mature Adult";
    } else if (/zoning|council|transit|municipal|amendment|vote|civic/i.test(lower)) {
      category = "Politics";
    } else if (/marathon|leg day|fitness|running|wellness|sleep/i.test(lower)) {
      category = "Lifestyle";
      gender = "Female";
    } else {
      category = "Other";
    }

    return {
      id,
      sanitizedText,
      category,
      demographics: {
        ageGroup,
        gender,
      },
      hadPii,
    };
  });
}

function parseAndValidatePosts(rawJsonText: string): ExtractedPost[] {
  const cleanedText = rawJsonText
    .replace(/^\s*```json/i, "")
    .replace(/^\s*```/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  const parsed = JSON.parse(cleanedText);

  if (!Array.isArray(parsed)) {
    throw new Error("Gemini returned invalid structure: expected array");
  }

  return parsed.map((item, idx) => {
    const safe = ExtractedPostSchema.safeParse({
      id: item.id || `post-${idx + 1}`,
      sanitizedText: item.sanitizedText || "",
      category: item.category || "Other",
      demographics: {
        ageGroup: item.demographics?.ageGroup || "Unspecified",
        gender: item.demographics?.gender || "Unspecified",
      },
      hadPii: Boolean(item.hadPii),
    });

    if (!safe.success) {
      return {
        id: `post-${idx + 1}`,
        sanitizedText: item.sanitizedText || "Sanitized content",
        category: "Other" as const,
        demographics: {
          ageGroup: "Unspecified" as const,
          gender: "Unspecified" as const,
        },
        hadPii: false,
      };
    }
    return safe.data;
  });
}

export async function extractWithGemini(
  rawText: string
): Promise<{ posts: ExtractedPost[]; engine: string }> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    return {
      posts: generateSimulatedExtraction(rawText),
      engine: "Offline Simulated Engine",
    };
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const primaryModelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";

  const prompt = `You are a privacy-first data extraction engine for social media intelligence (Meta Threads posts).
Analyze the following raw scraped text containing one or more social posts.

Your tasks:
1. Break down the input into individual posts.
2. For each post, strip ALL personally identifiable information (PII) such as @usernames, full names, email addresses, phone numbers, user IDs, and contact info. Replace handles and emails with contextually sanitized text or remove them, but keep the core message and topical hashtags/emojis. Set "hadPii" to true if PII was scrubbed.
3. Classify each post into exactly ONE category: "Sports" | "Politics" | "Tech" | "Business" | "Entertainment" | "Lifestyle" | "Other".
4. Infer high-level demographic signals only when supported by linguistic evidence or context:
   - ageGroup: "Gen Z / Youth" | "Millennial / Young Adult" | "Mature Adult" | "Unspecified"
   - gender: "Male" | "Female" | "Non-Binary" | "Unspecified"
   CRITICAL: If a post has no demographic clues (e.g. neutral traffic updates, technical questions, general queries), you MUST label them as "Unspecified".

Raw scraped text:
"""
${rawText}
"""

Return a JSON array conforming strictly to:
[
  {
    "id": "post-1",
    "sanitizedText": "clean text without usernames or emails",
    "category": "Sports" | "Politics" | "Tech" | "Business" | "Entertainment" | "Lifestyle" | "Other",
    "demographics": {
      "ageGroup": "Gen Z / Youth" | "Millennial / Young Adult" | "Mature Adult" | "Unspecified",
      "gender": "Male" | "Female" | "Non-Binary" | "Unspecified"
    },
    "hadPii": true
  }
]`;

  try {
    const model = genAI.getGenerativeModel({
      model: primaryModelName,
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.1,
      },
    });

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const posts = parseAndValidatePosts(responseText);

    return {
      posts,
      engine: `Gemini ${primaryModelName.replace("gemini-", "").toUpperCase()} (Live API)`,
    };
  } catch (primaryErr) {
    console.warn(`Primary Gemini model (${primaryModelName}) error, attempting gemini-1.5-flash:`, primaryErr);

    try {
      const fallbackModel = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.1,
        },
      });

      const fallbackResult = await fallbackModel.generateContent(prompt);
      const fallbackText = fallbackResult.response.text();
      const posts = parseAndValidatePosts(fallbackText);

      return {
        posts,
        engine: "Gemini 1.5 Flash (Live API)",
      };
    } catch (fallbackErr) {
      console.error("Gemini API call failed completely, using offline heuristic:", fallbackErr);
      return {
        posts: generateSimulatedExtraction(rawText),
        engine: "Offline Fallback (API Error)",
      };
    }
  }
}
