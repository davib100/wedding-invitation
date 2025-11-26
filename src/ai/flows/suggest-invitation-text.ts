'use server';

/**
 * @fileOverview A flow that suggests elegant and romantic invitation text using generative AI based on a short description.
 *
 * - suggestInvitationText - A function that suggests invitation text.
 * - SuggestInvitationTextInput - The input type for the suggestInvitationText function.
 * - SuggestInvitationTextOutput - The return type for the suggestInvitationText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestInvitationTextInputSchema = z.object({
  description: z
    .string()
    .describe(
      'A short description of the desired tone and content for the invitation text.'
    ),
});
export type SuggestInvitationTextInput = z.infer<typeof SuggestInvitationTextInputSchema>;

const SuggestInvitationTextOutputSchema = z.object({
  invitationText: z
    .string()
    .describe('An elegant and romantic invitation text suggestion.'),
});
export type SuggestInvitationTextOutput = z.infer<typeof SuggestInvitationTextOutputSchema>;

export async function suggestInvitationText(
  input: SuggestInvitationTextInput
): Promise<SuggestInvitationTextOutput> {
  return suggestInvitationTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestInvitationTextPrompt',
  input: {schema: SuggestInvitationTextInputSchema},
  output: {schema: SuggestInvitationTextOutputSchema},
  prompt: `You are a wedding invitation expert with a deep understanding of romantic and elegant language.

  Based on the description provided, suggest invitation text that captures the desired tone and content. Be creative, and ensure the text is suitable for a luxurious and sophisticated wedding invitation.

  Description: {{{description}}}

  Invitation Text:`, // Removed the word suggestion from the prompt
});

const suggestInvitationTextFlow = ai.defineFlow(
  {
    name: 'suggestInvitationTextFlow',
    inputSchema: SuggestInvitationTextInputSchema,
    outputSchema: SuggestInvitationTextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
