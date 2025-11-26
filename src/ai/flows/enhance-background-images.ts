'use server';

/**
 * @fileOverview A flow to enhance background images using AI.
 *
 * - enhanceBackgroundImage - A function that enhances a background image.
 * - EnhanceBackgroundImageInput - The input type for the enhanceBackgroundImage function.
 * - EnhanceBackgroundImageOutput - The return type for the enhanceBackgroundImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnhanceBackgroundImageInputSchema = z.object({
  backgroundPhotoDataUri: z
    .string()
    .describe(
      "A background photo, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type EnhanceBackgroundImageInput = z.infer<
  typeof EnhanceBackgroundImageInputSchema
>;

const EnhanceBackgroundImageOutputSchema = z.object({
  enhancedPhotoDataUri: z
    .string()
    .describe(
      'The enhanced background photo, as a data URI that includes a MIME type and uses Base64 encoding.'
    ),
});
export type EnhanceBackgroundImageOutput = z.infer<
  typeof EnhanceBackgroundImageOutputSchema
>;

export async function enhanceBackgroundImage(
  input: EnhanceBackgroundImageInput
): Promise<EnhanceBackgroundImageOutput> {
  return enhanceBackgroundImageFlow(input);
}

const enhanceBackgroundImageFlow = ai.defineFlow(
  {
    name: 'enhanceBackgroundImageFlow',
    inputSchema: EnhanceBackgroundImageInputSchema,
    outputSchema: EnhanceBackgroundImageOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.5-flash-image-preview',
      prompt: [
        {media: {url: input.backgroundPhotoDataUri}},
        {
          text: 'enhance the resolution and quality of this image, making it suitable for a premium and elegant wedding invitation.',
        },
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media) {
      throw new Error('No enhanced image was generated.');
    }

    return {enhancedPhotoDataUri: media.url!};
  }
);
