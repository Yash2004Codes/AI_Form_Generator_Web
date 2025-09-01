import Link from 'next/link';
import { Eye, PlusCircle, BarChart3, Trash2 } from 'lucide-react';
import { getFormsByUser } from '@/lib/db';
import { deleteFormAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
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
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default async function DashboardPage() {
  const forms = await getFormsByUser("user1"); // Mock user

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-headline">My Forms</h2>
          <p className="text-muted-foreground">
            View, manage, and analyze your forms and submissions.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/create">
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Form
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Forms</CardTitle>
          <CardDescription>
            A list of all the forms you have created.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {forms.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead className="text-center">Submissions</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {forms.map((form) => (
                  <TableRow key={form.id}>
                    <TableCell className="font-medium">{form.title}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">{form.submissionCount}</Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(form.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <TooltipProvider>
                        <div className="flex justify-end gap-2">
                          {/* View Live Form */}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" asChild>
                                <Link href={`/form/${form.id}`} target="_blank">
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View Live Form</p>
                            </TooltipContent>
                          </Tooltip>

                          {/* View Submissions */}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" asChild>
                                <Link href={`/dashboard/forms/${form.id}/submissions`}>
                                  <BarChart3 className="h-4 w-4" />
                                </Link>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View Submissions</p>
                            </TooltipContent>
                          </Tooltip>

                          {/* Delete Form with Confirmation */}
                          <AlertDialog>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <AlertDialogTrigger asChild>
                                  <Button variant="destructive" size="icon">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Delete Form</p>
                              </TooltipContent>
                            </Tooltip>

                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Form?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete <b>{form.title}</b> and all its submissions.
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <form
                                  action={async () => {
                                    "use server";
                                    await deleteFormAction(form.id);
                                  }}
                                >
                                  <AlertDialogAction type="submit" className="bg-red-600 hover:bg-red-700">
                                    Delete
                                  </AlertDialogAction>
                                </form>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TooltipProvider>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold">No forms yet</h3>
              <p className="text-muted-foreground mt-1">
                Click "Create New Form" to get started with your first AI-generated form.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
