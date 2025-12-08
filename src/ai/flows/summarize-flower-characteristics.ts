'use server';

/**
 * @fileOverview Summarizes flower characteristics, common uses, and interesting facts after identification.
 *
 * - summarizeFlower - A function that takes a flower name and returns a summary of its characteristics, uses, and facts.
 * - SummarizeFlowerInput - The input type for the summarizeFlower function.
 * - SummarizeFlowerOutput - The return type for the summarizeFlower function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeFlowerInputSchema = z.object({
  flowerName: z.string().describe('The common name of the flower.'),
});
export type SummarizeFlowerInput = z.infer<typeof SummarizeFlowerInputSchema>;

const SummarizeFlowerOutputSchema = z.object({
  summary: z.string().describe('A short summary about the flower characteristics, common uses, and interesting facts.'),
});
export type SummarizeFlowerOutput = z.infer<typeof SummarizeFlowerOutputSchema>;

export async function summarizeFlower(input: SummarizeFlowerInput): Promise<SummarizeFlowerOutput> {
  return summarizeFlowerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeFlowerPrompt',
  input: {schema: SummarizeFlowerInputSchema},
  output: {schema: SummarizeFlowerOutputSchema},
  prompt: `You are an expert botanist. Summarize the characteristics, common uses, and interesting facts about the following flower: {{{flowerName}}}. Keep the summary concise, aiming for approximately 50-75 words. Focus on information that would be interesting and accessible to a general audience.`,
});

const summarizeFlowerFlow = ai.defineFlow(
  {
    name: 'summarizeFlowerFlow',
    inputSchema: SummarizeFlowerInputSchema,
    outputSchema: SummarizeFlowerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
