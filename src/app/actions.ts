'use server';

import { generateAccuracyTips } from '@/ai/flows/generate-accuracy-tips';
import type { GenerateAccuracyTipsOutput } from '@/ai/flows/generate-accuracy-tips';

export async function getAccuracyTips(flowerType: string): Promise<GenerateAccuracyTipsOutput> {
  try {
    const result = await generateAccuracyTips({ flowerType });
    return result;
  } catch (error) {
    console.error("Error generating accuracy tips:", error);
    // Return a default or empty response in case of failure
    return { tips: [] };
  }
}
