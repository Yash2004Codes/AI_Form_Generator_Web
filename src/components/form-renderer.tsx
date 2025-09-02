"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import type { FormSchema, FormFieldDefinition } from "@/lib/types";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

// 🔹 Build Zod schema dynamically
const buildZodSchema = (fields: FormFieldDefinition[]) => {
  const zodSchema: Record<string, z.ZodTypeAny> = {};

  fields.forEach((field) => {
    let fieldSchema: z.ZodTypeAny;

    switch (field.type) {
      case "text":
      case "textarea":
      case "password":
        fieldSchema = z.string();
        break;
      case "email":
        fieldSchema = z.string().email("Invalid email address");
        break;
      case "number":
        fieldSchema = z.coerce.number();
        break;
      case "date":
        fieldSchema = z.date();
        break;
      case "select":
      case "radio":
        fieldSchema = z.string();
        break;
      case "checkbox":
        fieldSchema = z.boolean().default(false);
        break;
      case "file":
        // ✅ Expect a URL string, not File
        fieldSchema = z.string().url("File upload failed. Please try again.");
        break;
      default:
        fieldSchema = z.any();
    }

    if (field.required && field.type !== "checkbox") {
      if (fieldSchema instanceof z.ZodString) {
        fieldSchema = fieldSchema.min(1, `${field.label} is required.`);
      }
    }
    if (field.required && field.type === "checkbox") {
      fieldSchema = fieldSchema.refine((val) => val === true, {
        message: `You must agree to the ${field.label.toLowerCase()}.`,
      });
    }

    zodSchema[field.name] = field.required ? fieldSchema : fieldSchema.optional();
  });

  return z.object(zodSchema);
};

type FormRendererProps = {
  schema: FormSchema;
  onSubmit: (data: Record<string, any>) => void;
  isSubmitting?: boolean;
};

export default function FormRenderer({ schema, onSubmit, isSubmitting = false }: FormRendererProps) {
  const zodSchema = buildZodSchema(schema.fields);
  const form = useForm<z.infer<typeof zodSchema>>({
    resolver: zodResolver(zodSchema),
  });

  const renderField = (fieldDefinition: FormFieldDefinition, formField: any) => {
    const { type, label, placeholder, options, name } = fieldDefinition;

    switch (type) {
      case "text":
      case "email":
      case "password":
      case "number":
        return <Input type={type} placeholder={placeholder} {...formField} />;

      case "textarea":
        return <Textarea placeholder={placeholder} {...formField} />;

      case "select":
        return (
          <Select onValueChange={formField.onChange} defaultValue={formField.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder || "Select an option"} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "radio":
        return (
          <RadioGroup onValueChange={formField.onChange} defaultValue={formField.value} className="flex flex-col space-y-1">
            {options?.map((option) => (
              <FormItem key={option} className="flex items-center space-x-3 space-y-0">
                <FormControl>
                  <RadioGroupItem value={option} />
                </FormControl>
                <FormLabel className="font-normal">{option}</FormLabel>
              </FormItem>
            ))}
          </RadioGroup>
        );

      case "checkbox":
        return (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox checked={formField.value} onCheckedChange={formField.onChange} />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>{label}</FormLabel>
              {placeholder && <FormDescription>{placeholder}</FormDescription>}
            </div>
          </FormItem>
        );

      case "date":
        return (
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !formField.value && "text-muted-foreground"
                  )}
                >
                  {formField.value ? format(formField.value, "PPP") : <span>{placeholder || "Pick a date"}</span>}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={formField.value} onSelect={formField.onChange} initialFocus />
            </PopoverContent>
          </Popover>
        );

      case "file":
        return (
          <div className="space-y-2">
            <Input
              type="file"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                const formData = new FormData();
                formData.append("file", file);

                const res = await fetch("/api/upload", {
                  method: "POST",
                  body: formData,
                });

                const data = await res.json();
                console.log("Uploaded file URL:", data.url);

                // ✅ Replace File object with Cloudinary URL in state
                formField.onChange(data.url);
              }}
            />
            {formField.value && (
              <a href={formField.value} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                Uploaded File
              </a>
            )}
          </div>
        );

      default:
        return <Input type="text" placeholder={placeholder} {...formField} />;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {schema.fields.map((fieldDefinition) => (
          <FormField
            key={fieldDefinition.name}
            control={form.control}
            name={fieldDefinition.name}
            render={({ field }) => (
              <FormItem>
                {fieldDefinition.type !== "checkbox" && <FormLabel>{fieldDefinition.label}</FormLabel>}
                <FormControl>{renderField(fieldDefinition, field)}</FormControl>
                {fieldDefinition.type !== "checkbox" &&
                  fieldDefinition.placeholder &&
                  fieldDefinition.type !== "text" && <FormDescription>{fieldDefinition.placeholder}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
