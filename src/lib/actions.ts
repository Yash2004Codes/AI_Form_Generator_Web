'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { generateFormSchemaFromPrompt } from '@/ai/flows/generate-form-schema-from-prompt';
import { addForm, addSubmission } from '@/lib/db';
import { FormSchema } from './types';

export async function generateFormAction(
  prevState: { error?: string; schema?: FormSchema },
  formData: FormData
) {
  const prompt = formData.get('prompt') as string;

  if (!prompt || prompt.trim().length < 10) {
    return { error: 'Please provide a more detailed prompt.' };
  }

  try {
    const result = await generateFormSchemaFromPrompt({ prompt });
    const schema = JSON.parse(result.jsonSchema) as FormSchema;
    
    if (!schema.fields || !schema.title) {
        // Fallback title if AI fails to provide one
        schema.title = "Generated Form";
    }

    return { schema };
  } catch (e) {
    console.error(e);
    return { error: 'Failed to generate form. Please try again.' };
  }
}

export async function saveFormAction(schema: FormSchema) {
  try {
    // Using a mock user ID
    const newForm = await addForm('user1', schema.title, schema.description || '', schema);
  } catch (e) {
    console.error(e);
    return { error: 'Failed to save the form.' };
  }
  
  revalidatePath('/dashboard');
  redirect('/dashboard');
}

export async function saveSubmissionAction(formId: string, data: Record<string, any>) {
    try {
        await addSubmission(formId, data);
    } catch(e) {
        console.error(e);
        return { error: 'Failed to save submission.' };
    }

    revalidatePath(`/form/${formId}`);
    redirect(`/form/${formId}/success`);
}
