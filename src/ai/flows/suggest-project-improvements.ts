// src/ai/flows/suggest-project-improvements.ts
'use server';

/**
 * @fileOverview An AI agent that suggests improvements to project details.
 *
 * - suggestProjectImprovements - A function that suggests improvements to project tags, titles, and descriptions using AI.
 * - SuggestProjectImprovementsInput - The input type for the suggestProjectImprovements function.
 * - SuggestProjectImprovementsOutput - The return type for the suggestProjectImprovements function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestProjectImprovementsInputSchema = z.object({
  title: z.string().describe('The current title of the project.'),
  description: z.string().describe('The current description of the project.'),
  tags: z.array(z.string()).describe('The current tags associated with the project.'),
});
export type SuggestProjectImprovementsInput = z.infer<typeof SuggestProjectImprovementsInputSchema>;

const SuggestProjectImprovementsOutputSchema = z.object({
  suggestedTitle: z.string().describe('The suggested title for the project.'),
  suggestedDescription: z.string().describe('The suggested description for the project.'),
  suggestedTags: z.array(z.string()).describe('The suggested tags for the project.'),
});
export type SuggestProjectImprovementsOutput = z.infer<typeof SuggestProjectImprovementsOutputSchema>;

export async function suggestProjectImprovements(
  input: SuggestProjectImprovementsInput
): Promise<SuggestProjectImprovementsOutput> {
  return suggestProjectImprovementsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestProjectImprovementsPrompt',
  input: {schema: SuggestProjectImprovementsInputSchema},
  output: {schema: SuggestProjectImprovementsOutputSchema},
  prompt: `You are an AI assistant that helps developers improve the discoverability and appeal of their projects.

  Given the current project title, description, and tags, suggest improvements to each of them.

  Current Title: {{{title}}}
  Current Description: {{{description}}}
  Current Tags: {{#each tags}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

  Your suggestions should be clear, concise, and aimed at improving the project's visibility and attractiveness to potential users or collaborators.
  Ensure that the suggested tags are relevant to the project and cover a wide range of potential search terms.
`,
});

const suggestProjectImprovementsFlow = ai.defineFlow(
  {
    name: 'suggestProjectImprovementsFlow',
    inputSchema: SuggestProjectImprovementsInputSchema,
    outputSchema: SuggestProjectImprovementsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
