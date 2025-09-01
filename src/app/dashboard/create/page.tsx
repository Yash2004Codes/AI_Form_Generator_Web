"use client";

import { useFormState, useFormStatus } from 'react-dom';
import { Bot, Save, Wand2, Loader2 } from 'lucide-react';

import { generateFormAction, saveFormAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import FormRenderer from '@/components/form-renderer';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Wand2 className="mr-2 h-4 w-4" />
          Generate Form
        </>
      )}
    </Button>
  );
}

export default function CreateFormPage() {
  const [state, formAction] = useFormState(generateFormAction, {});

  const handleSaveForm = async () => {
    if (state.schema) {
      await saveFormAction(state.schema);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight font-headline">Create a New Form</h2>
        <p className="text-muted-foreground">
          Describe the form you want to build, and let AI do the heavy lifting.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-6 w-6" />
            AI Form Generator
          </CardTitle>
          <CardDescription>
            Enter a prompt describing your form. Be as specific as possible. For example, "Create a contact form with fields for name, email, and message."
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <Textarea
              name="prompt"
              placeholder="e.g., A simple contact form with name, email, and a message."
              rows={4}
              required
              minLength={10}
            />
            {state.error && (
              <Alert variant="destructive">
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}
            <div className="flex justify-end">
                <SubmitButton />
            </div>
          </form>
        </CardContent>
      </Card>

      {state.schema && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Form Preview</CardTitle>
                <CardDescription>This is what your generated form will look like.</CardDescription>
            </div>
            <Button onClick={handleSaveForm}>
              <Save className="mr-2 h-4 w-4" />
              Save Form
            </Button>
          </CardHeader>
          <CardContent>
            <div className="p-6 border rounded-lg">
                <h3 className="text-2xl font-bold font-headline mb-2">{state.schema.title}</h3>
                <p className="text-muted-foreground mb-6">{state.schema.description}</p>
                <FormRenderer
                    schema={state.schema}
                    onSubmit={(data) => console.log('Preview submission:', data)}
                />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
