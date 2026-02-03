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
    .describe('The student profile, including academic background, bio, and skills.'),
  alumniProfiles: z
    .array(z.object({
      id: z.string(),
      fullName: z.string(),
      role: z.string(),
      bio: z.string(),
      skills: z.array(z.string()),
    }))
    .describe('A list of available alumni mentors.'),
});
export type MatchAlumniMentorsInput = z.infer<typeof MatchAlumniMentorsInputSchema>;

const MatchAlumniMentorsOutputSchema = z.object({
  recommendedMentorIds: z
    .array(z.string())
    .describe('An array of IDs for the alumni who are the best matches for the student.'),
  reasoning: z.string().describe('A brief explanation of why these mentors were chosen.'),
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
  prompt: `You are an expert career counselor and AI matchmaker. Your goal is to connect university students with the most suitable alumni mentors.

Analyze the student's profile and compare it against the list of available mentors. Look for overlaps in skills, industry interests, and potential career paths.

Student Profile:
{{{studentProfile}}}

Available Alumni Mentors:
{{#each alumniProfiles}}
- ID: {{id}}, Name: {{fullName}}, Role: {{role}}, Bio: {{bio}}, Skills: {{#each skills}}{{this}}, {{/each}}
{{/each}}

Identify the top 3 (or fewer if not applicable) mentors who would be the most beneficial for this student. Return their IDs and a short, encouraging summary of why they are a good match.
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
