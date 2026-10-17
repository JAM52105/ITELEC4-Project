import { useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createSubmission, fetchCourses, fetchSubmissions } from "../api/client";
import type { ApiSubmission, NewSubmission } from "../types/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function CourseSubmissionsPage() {
  const queryClient = useQueryClient();
  const [courseCode, setCourseCode] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const courses = useQuery({ queryKey: ["courses"], queryFn: fetchCourses });
  const submissions = useQuery<ApiSubmission[]>({
    queryKey: ["course-submissions"],
    queryFn: fetchSubmissions,
  });
  const addSubmission = useMutation({
    mutationFn: (submission: NewSubmission) => createSubmission(submission),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["course-submissions"] });
      setRepoUrl("");
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    addSubmission.mutate({ courseCode, repoUrl });
  };

  if (courses.isPending || submissions.isPending) {
    return <div className="animate-pulse p-6">Loading course submissions...</div>;
  }

  if (courses.isError || submissions.isError) {
    return (
      <div role="alert" className="rounded-lg bg-red-50 p-4 text-red-700">
        {courses.error?.message ?? submissions.error?.message}
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
        Course Submissions
      </h2>
      <form onSubmit={handleSubmit} className="mb-6 flex max-w-xl flex-wrap items-end gap-3">
        <div className="min-w-48 flex-1">
          <Label htmlFor="courseCode" className="mb-1">Course</Label>
          <select
            id="courseCode"
            value={courseCode}
            onChange={(event) => setCourseCode(event.target.value)}
            required
            className="w-full rounded border border-gray-300 bg-white p-2 dark:bg-gray-800"
          >
            <option value="" disabled>Select a course</option>
            {courses.data.map((course) => (
              <option key={course.code} value={course.code}>
                {course.code} — {course.title}
              </option>
            ))}
          </select>
        </div>
        <div className="min-w-64 flex-1">
          <Label htmlFor="repoUrl" className="mb-1">Repository URL</Label>
          <Input
            id="repoUrl"
            type="url"
            value={repoUrl}
            onChange={(event) => setRepoUrl(event.target.value)}
            placeholder="https://github.com/username/project"
            required
          />
        </div>
        <Button type="submit" disabled={addSubmission.isPending}>
          {addSubmission.isPending ? "Submitting..." : "Submit"}
        </Button>
      </form>
      {addSubmission.isError && (
        <p role="alert" className="mb-4 text-sm text-red-700">{addSubmission.error.message}</p>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {submissions.data.map((submission) => (
          <article
            key={submission.id}
            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"
          >
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">
              {submission.courseCode}
            </h3>
            <a
              href={submission.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="break-all text-sm text-blue-700 underline"
            >
              {submission.repoUrl}
            </a>
            <p className="mt-2 text-sm text-slate-500">
              Submitted {new Date(submission.submittedAt).toLocaleString()}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}

export default CourseSubmissionsPage;
