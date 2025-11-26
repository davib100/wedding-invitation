'use server';

/**
 * @fileOverview A flow to generate a romantic subtitle for a wedding invitation.
 *
 * - generateRomanticSubtitle - A function that generates a romantic subtitle.
 * - GenerateRomanticSubtitleInput - The input type for the generateRomanticSubtitle function.
 * - GenerateRomanticSubtitleOutput - The return type for the generateRomanticSubtitle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRomanticSubtitleInputSchema = z.object({
  groomName: z.string().describe('The name of the groom.'),
  brideName: z.string().describe('The name of the bride.'),
});
export type GenerateRomanticSubtitleInput = z.infer<
  typeof GenerateRomanticSubtitleInputSchema
>;

const GenerateRomanticSubtitleOutputSchema = z.object({
  subtitle: z.string().describe('The generated romantic subtitle.'),
});
export type GenerateRomanticSubtitleOutput = z.infer<
  typeof GenerateRomanticSubtitleOutputSchema
>;

export async function generateRomanticSubtitle(
  input: GenerateRomanticSubtitleInput
): Promise<GenerateRomanticSubtitleOutput> {
  return generateRomanticSubtitleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRomanticSubtitlePrompt',
  input: {schema: GenerateRomanticSubtitleInputSchema},
  output: {schema: GenerateRomanticSubtitleOutputSchema},
  prompt: `You are a professional wedding invitation writer.
  Generate a romantic and elegant subtitle for the wedding invitation of {{groomName}} and {{brideName}}.
  The subtitle should be short, memorable, and reflect the couple's love story.`,
});

const generateRomanticSubtitleFlow = ai.defineFlow(
  {
    name: 'generateRomanticSubtitleFlow',
    inputSchema: GenerateRomanticSubtitleInputSchema,
    outputSchema: GenerateRomanticSubtitleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
