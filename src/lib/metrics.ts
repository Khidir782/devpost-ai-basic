import { ExtractedPost, PipelineMetrics } from "./schemas";

export function calculateMetrics(posts: ExtractedPost[]): PipelineMetrics {
  const totalPosts = posts.length;

  if (totalPosts === 0) {
    return {
      totalPosts: 0,
      piiScrubbedCount: 0,
      categoryDistribution: {},
      demographicDistribution: {
        ageGroup: {},
        gender: {},
        unspecifiedOutliers: {
          ageCount: 0,
          genderCount: 0,
        },
      },
    };
  }

  // 1. PII Scrubbed Count
  const piiScrubbedCount = posts.filter((p) => p.hadPii).length;

  // 2. Category Distribution
  const categoryCounts: Record<string, number> = {};
  for (const post of posts) {
    const cat = post.category || "Other";
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  }

  const categoryDistribution: PipelineMetrics["categoryDistribution"] = {};
  for (const [cat, count] of Object.entries(categoryCounts)) {
    categoryDistribution[cat] = {
      count,
      percentage: Number(((count / totalPosts) * 100).toFixed(1)),
    };
  }

  // 3. Demographic Distribution: Age Group
  const ageCounts: Record<string, number> = {};
  let unspecifiedAgeCount = 0;

  for (const post of posts) {
    const age = post.demographics?.ageGroup || "Unspecified";
    if (age === "Unspecified") {
      unspecifiedAgeCount++;
    } else {
      ageCounts[age] = (ageCounts[age] || 0) + 1;
    }
  }

  const specifiedAgeTotal = totalPosts - unspecifiedAgeCount;
  const ageDistribution: Record<string, { count: number; percentage: number }> = {};

  for (const [age, count] of Object.entries(ageCounts)) {
    ageDistribution[age] = {
      count,
      percentage:
        specifiedAgeTotal > 0
          ? Number(((count / specifiedAgeTotal) * 100).toFixed(1))
          : 0,
    };
  }

  // 4. Demographic Distribution: Gender
  const genderCounts: Record<string, number> = {};
  let unspecifiedGenderCount = 0;

  for (const post of posts) {
    const gender = post.demographics?.gender || "Unspecified";
    if (gender === "Unspecified") {
      unspecifiedGenderCount++;
    } else {
      genderCounts[gender] = (genderCounts[gender] || 0) + 1;
    }
  }

  const specifiedGenderTotal = totalPosts - unspecifiedGenderCount;
  const genderDistribution: Record<string, { count: number; percentage: number }> = {};

  for (const [gender, count] of Object.entries(genderCounts)) {
    genderDistribution[gender] = {
      count,
      percentage:
        specifiedGenderTotal > 0
          ? Number(((count / specifiedGenderTotal) * 100).toFixed(1))
          : 0,
    };
  }

  return {
    totalPosts,
    piiScrubbedCount,
    categoryDistribution,
    demographicDistribution: {
      ageGroup: ageDistribution,
      gender: genderDistribution,
      unspecifiedOutliers: {
        ageCount: unspecifiedAgeCount,
        genderCount: unspecifiedGenderCount,
      },
    },
  };
}
