import { getSubmissionsForForm, getFormById } from "@/lib/db";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default async function SubmissionsPage({ params }: { params: { id: string } }) {
  const submissions = await getSubmissionsForForm(params.id);
  const form = await getFormById(params.id);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold font-headline">Submissions for {form?.title}</h2>
        <p className="text-muted-foreground">
          Manage and review all collected responses.
        </p>
      </div>

      {submissions.length > 0 ? (
        submissions.map((submission) => (
          <Card key={submission.id}>
            <CardHeader>
              <CardTitle>Submission</CardTitle>
              <CardDescription>
                Submitted on {new Date(submission.createdAt).toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(submission.data).map(([key, value]) => (
                <div key={key} className="space-y-1">
                  <span className="font-medium">{key}:</span>
                  {typeof value === "string" && value.startsWith("http") ? (
                    value.match(/\.(jpeg|jpg|png|gif|webp)$/i) ? (
                      // 🔹 Image file
                      <a href={value} target="_blank" rel="noopener noreferrer">
                        <img
                          src={value}
                          alt={key}
                          className="w-32 h-32 object-cover rounded-md border"
                        />
                      </a>
                    ) : (
                      // 🔹 Other file (PDF, DOCX, etc.)
                      <a
                        href={value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        View / Download File
                      </a>
                    )
                  ) : (
                    <span>{String(value)}</span>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="text-muted-foreground">No submissions yet.</p>
      )}
    </div>
  );
}
