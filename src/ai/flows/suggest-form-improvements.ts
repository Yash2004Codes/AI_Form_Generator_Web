'use server';

/**
 * @fileOverview An AI agent that suggests improvements to a form schema.
 *
 * - suggestFormImprovements - A function that suggests improvements to a form schema.
 * - SuggestFormImprovementsInput - The input type for the suggestFormImprovements function.
 * - SuggestFormImprovementsOutput - The return type for the suggestFormImprovements function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestFormImprovementsInputSchema = z.object({
  formSchema: z
    .string()
    .describe('The JSON schema of the form to be improved.'),
});
export type SuggestFormImprovementsInput = z.infer<typeof SuggestFormImprovementsInputSchema>;

const SuggestFormImprovementsOutputSchema = z.object({
  improvedFormSchema: z
    .string()
    .describe('The improved JSON schema of the form.'),
  suggestions: z.string().describe('A summary of the improvements made.'),
});
export type SuggestFormImprovementsOutput = z.infer<typeof SuggestFormImprovementsOutputSchema>;

export async function suggestFormImprovements(
  input: SuggestFormImprovementsInput
): Promise<SuggestFormImprovementsOutput> {
  return suggestFormImprovementsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestFormImprovementsPrompt',
  input: {schema: SuggestFormImprovementsInputSchema},
  output: {schema: SuggestFormImprovementsOutputSchema},
  prompt: `You are an AI expert in form design and usability. Review the provided JSON form schema and suggest improvements based on best practices. Provide specific recommendations for enhancing the form's structure, input types, validation rules, and overall user experience. Return the updated schema in JSON format and provide a summary of changes.

Form Schema:
{{{formSchema}}}

Improved Form Schema (JSON):
`,
});

const suggestFormImprovementsFlow = ai.defineFlow(
  {
    name: 'suggestFormImprovementsFlow',
    inputSchema: SuggestFormImprovementsInputSchema,
    outputSchema: SuggestFormImprovementsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
