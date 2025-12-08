'use server';

import { generateAccuracyTips } from '@/ai/flows/generate-accuracy-tips';
import type { GenerateAccuracyTipsOutput } from '@/ai/flows/generate-accuracy-tips';
import { summarizeFlower } from '@/ai/flows/summarize-flower-characteristics';
import type { SummarizeFlowerOutput } from '@/ai/flows/summarize-flower-characteristics';

export async function getAccuracyTips(
  flowerType: string
): Promise<GenerateAccuracyTipsOutput> {
  try {
    const result = await generateAccuracyTips({ flowerType });
    return result;
  } catch (error) {
    console.error('Error generating accuracy tips:', error);
    // Return a default or empty response in case of failure
    return { tips: [] };
  }
}

export async function getFlowerSummary(
  flowerName: string
): Promise<SummarizeFlowerOutput> {
  try {
    const result = await summarizeFlower({ flowerName });
    return result;
  } catch (error) {
    console.error('Error generating flower summary:', error);
    return { summary: '' };
  }
}
