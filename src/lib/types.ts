import { ObjectId } from 'mongodb';

export type WithId<T> = T & { _id: ObjectId };

export type FormFieldDefinition = {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date' | 'file';
  required?: boolean;
  placeholder?: string;
  options?: string[];
};

export type FormSchema = {
  title: string;
  description?: string;
  fields: FormFieldDefinition[];
};

export type Form = {
  id: string;
  userId: string;
  title: string;
  description?: string;
  schema: FormSchema;
  createdAt: Date;
  submissionCount: number;
};

export type Submission = {
  id:string;
  formId: string;
  data: Record<string, any>;
  createdAt: Date;
};
