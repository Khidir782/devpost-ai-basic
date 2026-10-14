import { z } from "zod";

export const CategoryEnum = z.enum([
  "Sports",
  "Politics",
  "Tech",
  "Business",
  "Entertainment",
  "Lifestyle",
  "Other",
]);

export const AgeGroupEnum = z.enum([
  "Gen Z / Youth",
  "Millennial / Young Adult",
  "Mature Adult",
  "Unspecified",
]);

export const GenderEnum = z.enum([
  "Male",
  "Female",
  "Non-Binary",
  "Unspecified",
]);

export const ExtractedPostSchema = z.object({
  id: z.string(),
  sanitizedText: z.string().describe("Cleaned post content with all usernames, handles, emails, and phone numbers removed or scrubbed"),
  category: CategoryEnum,
  demographics: z.object({
    ageGroup: AgeGroupEnum,
    gender: GenderEnum,
  }),
  hadPii: z.boolean().default(false).describe("True if original post contained handles, emails, or personal identifiers that were scrubbed"),
});

export type ExtractedPost = z.infer<typeof ExtractedPostSchema>;

export const CategoryMetricSchema = z.object({
  count: z.number(),
  percentage: z.number(),
});

export const DemographicGroupMetricSchema = z.record(
  z.string(),
  z.object({
    count: z.number(),
    percentage: z.number(),
  })
);

export const PipelineMetricsSchema = z.object({
  totalPosts: z.number(),
  piiScrubbedCount: z.number(),
  categoryDistribution: z.record(z.string(), CategoryMetricSchema),
  demographicDistribution: z.object({
    ageGroup: DemographicGroupMetricSchema,
    gender: DemographicGroupMetricSchema,
    unspecifiedOutliers: z.object({
      ageCount: z.number(),
      genderCount: z.number(),
    }),
  }),
});

export type PipelineMetrics = z.infer<typeof PipelineMetricsSchema>;

export const ExtractionResponseSchema = z.object({
  success: z.boolean(),
  metrics: PipelineMetricsSchema,
  posts: z.array(ExtractedPostSchema),
  error: z.string().optional(),
});

export type ExtractionResponse = z.infer<typeof ExtractionResponseSchema>;
