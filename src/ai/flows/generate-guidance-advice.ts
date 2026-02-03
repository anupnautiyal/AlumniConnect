'use server';

/**
 * @fileOverview Provides initial AI advice for student guidance requests.
 *
 * - generateGuidanceAdvice - A function that provides immediate AI feedback on a question.
 * - GuidanceAdviceInput - The input type (title and description of the request).
 * - GuidanceAdviceOutput - The return type (AI advice text).
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GuidanceAdviceInputSchema = z.object({
  title: z.string().describe('The headline of the guidance request.'),
  description: z.string().describe('The detailed context of the student\'s question.'),
});
export type GuidanceAdviceInput = z.infer<typeof GuidanceAdviceInputSchema>;

const GuidanceAdviceOutputSchema = z.object({
  advice: z.string().describe('The AI-generated career advice or academic guidance.'),
  suggestedTags: z.array(z.string()).describe('Suggested tags for this topic.'),
});
export type GuidanceAdviceOutput = z.infer<typeof GuidanceAdviceOutputSchema>;

export async function generateGuidanceAdvice(
  input: GuidanceAdviceInput
): Promise<GuidanceAdviceOutput> {
  return generateGuidanceAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateGuidanceAdvicePrompt',
  input: {schema: GuidanceAdviceInputSchema},
  output: {schema: GuidanceAdviceOutputSchema},
  prompt: `You are an expert university career counselor and professional mentor. 
A student has posted the following request for guidance in our community forum:

Title: {{{title}}}
Details: {{{description}}}

Please provide a thoughtful, encouraging, and practical initial response. 
Your goal is to offer immediate value while the student waits for human alumni to reply. 

Break your advice into clear, actionable points. Keep the tone professional yet supportive. 
Also, suggest 2-3 short tags that categorize this request (e.g., "Networking", "Internships", "Career Path").
`,
});

const generateGuidanceAdviceFlow = ai.defineFlow(
  {
    name: 'generateGuidanceAdviceFlow',
    inputSchema: GuidanceAdviceInputSchema,
    outputSchema: GuidanceAdviceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
