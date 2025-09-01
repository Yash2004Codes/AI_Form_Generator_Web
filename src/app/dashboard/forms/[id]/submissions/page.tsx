import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { getFormById, getSubmissionsForForm } from '@/lib/db';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default async function SubmissionsPage({ params }: { params: { id: string } }) {
  const form = await getFormById(params.id);
  if (!form) {
    notFound();
  }
  const submissions = await getSubmissionsForForm(params.id);

  const headers = form.schema.fields.map(field => field.label);
  const fieldNames = form.schema.fields.map(field => field.name);

  return (
    <div className="space-y-8">
      <div>
        <Button variant="ghost" asChild className="-ml-4">
          <Link href="/dashboard">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Forms
          </Link>
        </Button>
        <h2 className="text-3xl font-bold tracking-tight font-headline mt-2">
          Submissions for "{form.title}"
        </h2>
        <p className="text-muted-foreground">
          A total of <Badge variant="secondary">{submissions.length}</Badge> submission(s).
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Collected Data</CardTitle>
          <CardDescription>
            Here are all the submissions received for this form.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {submissions.length > 0 ? (
            <div className="relative w-full overflow-auto">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Submitted At</TableHead>
                    {headers.map((header) => (
                        <TableHead key={header}>{header}</TableHead>
                    ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {submissions.map((submission) => (
                    <TableRow key={submission.id}>
                        <TableCell className="font-medium">
                        {new Date(submission.createdAt).toLocaleString()}
                        </TableCell>
                        {fieldNames.map((name) => (
                        <TableCell key={name}>
                            {typeof submission.data[name] === 'boolean'
                            ? submission.data[name] ? 'Yes' : 'No'
                            : submission.data[name]?.toString() || 'N/A'}
                        </TableCell>
                        ))}
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold">No submissions yet</h3>
              <p className="text-muted-foreground mt-1">
                Share your form to start collecting data.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
