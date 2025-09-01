'use server';
/**
 * @fileOverview A form schema generator AI agent.
 *
 * - generateFormSchemaFromPrompt - A function that generates a JSON schema for a form based on a user-provided text prompt.
 * - GenerateFormSchemaFromPromptInput - The input type for the generateFormSchemaFromPrompt function.
 * - GenerateFormSchemaFromPromptOutput - The return type for the generateFormSchemaFromPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFormSchemaFromPromptInputSchema = z.object({
  prompt: z.string().describe('A text prompt describing the form to generate.'),
});
export type GenerateFormSchemaFromPromptInput = z.infer<typeof GenerateFormSchemaFromPromptInputSchema>;

const GenerateFormSchemaFromPromptOutputSchema = z.object({
  jsonSchema: z.string().describe('The JSON schema generated from the prompt.'),
});
export type GenerateFormSchemaFromPromptOutput = z.infer<typeof GenerateFormSchemaFromPromptOutputSchema>;

export async function generateFormSchemaFromPrompt(input: GenerateFormSchemaFromPromptInput): Promise<GenerateFormSchemaFromPromptOutput> {
  return generateFormSchemaFromPromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFormSchemaFromPromptPrompt',
  input: {schema: GenerateFormSchemaFromPromptInputSchema},
  output: {schema: GenerateFormSchemaFromPromptOutputSchema},
  prompt: `You are a form schema generator AI. You will generate a JSON schema for a form based on the user-provided text prompt.

  Prompt: {{{prompt}}}

  The JSON schema should define the structure and fields of the form. Ensure that the generated JSON schema is valid and can be used to render the form dynamically.
  The JSON schema should have a top level array called 'fields', where each element in the array is a field in the form. Each field should have a 'type' property (e.g. text, number, select, file) and a 'label' property.
  Example schema:
  {
    "fields": [
      {
        "type": "text",
        "label": "First Name",
        "name": "firstName",
        "required": true,
      },
      {
        "type": "text",
        "label": "Last Name",
        "name": "lastName",
        "required": true,
      },
      {
        "type": "number",
        "label": "Age",
        "name": "age",
        "required": false,
      }
    ]
  }
  The output MUST be a valid JSON schema.
  Do not include any explanation, only the JSON schema.
  Here is the JSON schema:
  `,
});

const generateFormSchemaFromPromptFlow = ai.defineFlow(
  {
    name: 'generateFormSchemaFromPromptFlow',
    inputSchema: GenerateFormSchemaFromPromptInputSchema,
    outputSchema: GenerateFormSchemaFromPromptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
