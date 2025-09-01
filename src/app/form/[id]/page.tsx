import { notFound } from "next/navigation";
import { getFormById } from "@/lib/db";
import FormPageClient from "./FormPageClient"; // new client component

export default async function FormPage({ params }: { params: { id: string } }) {
  const form = await getFormById(params.id); // runs only on server

  if (!form) {
    notFound();
  }

  return <FormPageClient form={form} formId={params.id} />;
}
