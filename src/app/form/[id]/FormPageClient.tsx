"use client";

import { useTransition } from "react";
import { saveSubmissionAction } from "@/lib/actions";
import type { Form } from "@/lib/types";
import FormRenderer from "@/components/form-renderer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function FormPageClient({ form, formId }: { form: Form; formId: string }) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSubmit = (data: Record<string, any>) => {
    startTransition(async () => {
      const result = await saveSubmissionAction(formId, data);
      if (result?.error) {
        toast({
          title: "Submission Failed",
          description: result.error,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="container mx-auto max-w-2xl py-12 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold font-headline">{form.title}</CardTitle>
          {form.description && (
            <CardDescription className="text-lg">{form.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <FormRenderer schema={form.schema} onSubmit={handleSubmit} isSubmitting={isPending} />
        </CardContent>
      </Card>
    </div>
  );
}
