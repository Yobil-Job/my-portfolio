
// src/ai/flows/answer-project-question.ts
'use server';

/**
 * @fileOverview An AI agent that answers questions about a specific project.
 *
 * - answerProjectQuestion - A function that takes project details and a user's question, then returns an AI-generated answer.
 * - AnswerProjectQuestionInput - The input type for the answerProjectQuestion function.
 * - AnswerProjectQuestionOutput - The return type for the answerProjectQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerProjectQuestionInputSchema = z.object({
  projectTitle: z.string().describe('The title of the project.'),
  projectDescription: z.string().describe('The description of the project.'),
  projectTags: z.array(z.string()).describe('The tags associated with the project.'),
  userQuestion: z.string().describe("The user's question about the project."),
});
export type AnswerProjectQuestionInput = z.infer<typeof AnswerProjectQuestionInputSchema>;

const AnswerProjectQuestionOutputSchema = z.object({
  answer: z.string().describe("The AI's answer to the user's question."),
});
export type AnswerProjectQuestionOutput = z.infer<typeof AnswerProjectQuestionOutputSchema>;

export async function answerProjectQuestion(
  input: AnswerProjectQuestionInput
): Promise<AnswerProjectQuestionOutput> {
  return answerProjectQuestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerProjectQuestionPrompt',
  input: {schema: AnswerProjectQuestionInputSchema},
  output: {schema: AnswerProjectQuestionOutputSchema},
  prompt: `You are an expert AI assistant for the project titled "{{projectTitle}}".
  Your role is to answer questions from users based *only* on the information provided about this project.
  Do not invent features or information not present in the project description or tags.
  If the question cannot be answered with the provided details, politely state that the information is not available.

  Project Details:
  Title: {{{projectTitle}}}
  Description: {{{projectDescription}}}
  Tags: {{#each projectTags}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

  User's Question: {{{userQuestion}}}

  Provide a concise and helpful answer to the user's question based on the project details.
`,
});

const answerProjectQuestionFlow = ai.defineFlow(
  {
    name: 'answerProjectQuestionFlow',
    inputSchema: AnswerProjectQuestionInputSchema,
    outputSchema: AnswerProjectQuestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
