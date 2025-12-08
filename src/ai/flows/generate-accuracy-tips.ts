'use server';

/**
 * @fileOverview Generates tips for users on how to take better pictures of flowers to improve classification accuracy.
 *
 * - generateAccuracyTips - A function that generates accuracy tips.
 * - GenerateAccuracyTipsInput - The input type for the generateAccuracyTips function.
 * - GenerateAccuracyTipsOutput - The return type for the generateAccuracyTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAccuracyTipsInputSchema = z.object({
  flowerType: z.string().optional().describe('The type of flower the user is trying to identify.')
});
export type GenerateAccuracyTipsInput = z.infer<typeof GenerateAccuracyTipsInputSchema>;

const GenerateAccuracyTipsOutputSchema = z.object({
  tips: z.array(z.string()).describe('A list of tips for taking better flower photos.')
});
export type GenerateAccuracyTipsOutput = z.infer<typeof GenerateAccuracyTipsOutputSchema>;

export async function generateAccuracyTips(input: GenerateAccuracyTipsInput): Promise<GenerateAccuracyTipsOutput> {
  return generateAccuracyTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAccuracyTipsPrompt',
  input: {schema: GenerateAccuracyTipsInputSchema},
  output: {schema: GenerateAccuracyTipsOutputSchema},
  prompt: `You are an expert in providing advice on how to take high-quality photographs of flowers for accurate identification.

  Provide 3-5 concise tips to the user to improve their flower photography skills, focusing on aspects like lighting, focus, composition, and background.

  Consider the flower type ({{{flowerType}}}) if provided, tailoring the advice accordingly. If not provided give very generic advice.

  Ensure the tips are easy to understand and actionable for a non-photographer.

  Output the tips as a JSON array of strings.  The array should be called "tips".  Each tip should be a complete sentence ending with a period.
  `,
});

const generateAccuracyTipsFlow = ai.defineFlow(
  {
    name: 'generateAccuracyTipsFlow',
    inputSchema: GenerateAccuracyTipsInputSchema,
    outputSchema: GenerateAccuracyTipsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
