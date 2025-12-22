'use server';

// Define types locally to avoid importing from AI flows
export type GenerateAccuracyTipsOutput = {
  tips: string[];
};

export type SummarizeFlowerOutput = {
  summary: string;
};

export async function getAccuracyTips(
  flowerType: string
): Promise<GenerateAccuracyTipsOutput> {
  // Static tips for better photography, no AI required
  return {
    tips: [
      "Ensure the subject is well-lit and in focus.",
      "Get close to the subject to fill the frame.",
      "Try to isolate the subject from the background.",
      "Take photos from different angles.",
      "Avoid shadows and harsh lighting.",
    ]
  };
}

export async function getFlowerSummary(
  flowerName: string
): Promise<SummarizeFlowerOutput> {
  // Static summary since we are in offline mode
  // In a real offline app, you might query a local database here
  return {
    summary: `This is identified as ${flowerName}. Please consult a local field guide for detailed botanical information.`
  };
}
