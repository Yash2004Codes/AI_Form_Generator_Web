import { MongoClient, ObjectId, Collection } from 'mongodb';
import type { Form, Submission, FormSchema, WithId } from './types';
import { clientPromise } from './mongo';

async function getDb() {
  const client = await clientPromise;
  return client.db(process.env.MONGODB_DB || "formdb");
}

async function getCollections() {
  const db = await getDb();
  const formsCollection = db.collection<WithId<Form>>('forms');
  const submissionsCollection = db.collection<WithId<Submission>>('submissions');
  return { formsCollection, submissionsCollection };
}

function fromMongo<T extends { _id: ObjectId }>(doc: T | null): Omit<T, '_id'> & { id: string } | null {
    if (!doc) {
        return null;
    }
    const { _id, ...rest } = doc;
    return { ...rest, id: _id.toHexString() };
}

export async function getFormsByUser(userId: string): Promise<Form[]> {
  const { formsCollection } = await getCollections();
  const formsCursor = formsCollection.find({ userId });
  const formsArray = await formsCursor.toArray();
  return formsArray.map(form => fromMongo(form) as Form);
}

export async function getFormById(formId: string): Promise<Form | null> {
    if (!ObjectId.isValid(formId)) {
        return null;
    }
    const { formsCollection } = await getCollections();
    const form = await formsCollection.findOne({ _id: new ObjectId(formId) });
    return fromMongo(form);
}

export async function addForm(userId: string, title: string, description: string, schema: FormSchema): Promise<Form> {
  const { formsCollection } = await getCollections();
  const newForm: Omit<Form, 'id'> = {
    userId,
    title,
    description,
    schema,
    createdAt: new Date(),
    submissionCount: 0,
  };
  const result = await formsCollection.insertOne(newForm as WithId<Form>);
  return { ...newForm, id: result.insertedId.toHexString() };
}

export async function getSubmissionsForForm(formId: string): Promise<Submission[]> {
    if (!ObjectId.isValid(formId)) {
        return [];
    }
    const { submissionsCollection } = await getCollections();
    const submissionsCursor = submissionsCollection.find({ formId });
    const submissionsArray = await submissionsCursor.toArray();
    return submissionsArray.map(sub => fromMongo(sub) as Submission);
}

export async function addSubmission(formId: string, data: Record<string, any>): Promise<Submission> {
    const { submissionsCollection, formsCollection } = await getCollections();
    
    if (!ObjectId.isValid(formId)) {
        throw new Error('Invalid Form ID');
    }

    const form = await formsCollection.findOne({ _id: new ObjectId(formId) });
    if (!form) throw new Error('Form not found');

    const newSubmission: Omit<Submission, 'id'> = {
        formId,
        data,
        createdAt: new Date(),
    };

    const result = await submissionsCollection.insertOne(newSubmission as WithId<Submission>);

    await formsCollection.updateOne(
        { _id: new ObjectId(formId) },
        { $inc: { submissionCount: 1 } }
    );
  
    return { ...newSubmission, id: result.insertedId.toHexString() };
}
