'use server';

/**
 * @fileOverview Matches students with alumni mentors based on domain, skills, interests, and career goals.
 *
 * - matchAlumniMentors - A function that handles the matching process.
 * - MatchAlumniMentorsInput - The input type for the matchAlumniMentors function.
 * - MatchAlumniMentorsOutput - The return type for the matchAlumniMentors function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MatchAlumniMentorsInputSchema = z.object({
  studentProfile: z
    .string()
    .describe('The student profile, including academic background, interests, and career aspirations.'),
  alumniProfiles: z
    .string()
    .array()
    .describe('An array of alumni profiles, including experience, skills, and career paths.'),
});
export type MatchAlumniMentorsInput = z.infer<typeof MatchAlumniMentorsInputSchema>;

const MatchAlumniMentorsOutputSchema = z.object({
  matches: z
    .string()
    .array()
    .describe('An array of alumni profiles that are a good match for the student.'),
});
export type MatchAlumniMentorsOutput = z.infer<typeof MatchAlumniMentorsOutputSchema>;

export async function matchAlumniMentors(
  input: MatchAlumniMentorsInput
): Promise<MatchAlumniMentorsOutput> {
  return matchAlumniMentorsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'matchAlumniMentorsPrompt',
  input: {schema: MatchAlumniMentorsInputSchema},
  output: {schema: MatchAlumniMentorsOutputSchema},
  prompt: `You are an AI matchmaker that matches students with alumni mentors.

Analyze the student profile and the alumni profiles to find the best matches based on domain, skills, interests, and career goals.

Student Profile: {{{studentProfile}}}

Alumni Profiles: {{{alumniProfiles}}}

Return only the alumni profiles that are a good match for the student.
`,
});

const matchAlumniMentorsFlow = ai.defineFlow(
  {
    name: 'matchAlumniMentorsFlow',
    inputSchema: MatchAlumniMentorsInputSchema,
    outputSchema: MatchAlumniMentorsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
