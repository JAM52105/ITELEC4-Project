import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { askAi } from "../api/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { AiReply } from "../types/index";
import { aiReviewSchema, type AiReviewFormValues } from "../schemas/aiReviewSchema";

const ratingColors: Record<AiReply["rating"], string> = {
  needs_improvement: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  meets_expectations: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  strong: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
};

function AiReviewPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AiReviewFormValues>({
    resolver: zodResolver(aiReviewSchema),
    defaultValues: { prompt: "" },
  });

  const review = useMutation({
    mutationFn: ({ prompt }: AiReviewFormValues) => askAi(prompt),
  });

  const onSubmit = (values: AiReviewFormValues): void => {
    review.mutate(values);
  };

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">AI Review</h2>
      <p className="mb-4 max-w-2xl text-sm text-gray-600 dark:text-gray-300">
        Describe your project idea for Campus Lost &amp; Found, and get feedback on its
        usefulness, improvements, and privacy considerations.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="mb-6 max-w-2xl rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
      >
        <Label htmlFor="project-description" className="mb-1">
          Project description
        </Label>
        <textarea
          id="project-description"
          rows={6}
          maxLength={2000}
          placeholder="Describe the project idea you want reviewed..."
          {...register("prompt")}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
        />
        {errors.prompt && (
          <p role="alert" className="mt-1 text-sm text-red-700">
            {errors.prompt.message}
          </p>
        )}
        {review.isError && (
          <p role="alert" className="mt-2 text-sm text-red-700">
            {review.error.message}
          </p>
        )}
        <Button type="submit" disabled={review.isPending} className="mt-3">
          {review.isPending ? "Reviewing..." : "Submit for review"}
        </Button>
      </form>

      {review.isPending && (
        <p className="animate-pulse p-4" role="status">
          Reviewing your project description...
        </p>
      )}

      {review.data && (
        <section
          aria-labelledby="review-result-heading"
          className="max-w-2xl rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
        >
          <h3 id="review-result-heading" className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
            Review result
          </h3>
          <p className="mb-3 text-gray-700 dark:text-gray-200">{review.data.summary}</p>
          <p className="mb-4">
            <span className="mr-2 font-semibold text-gray-900 dark:text-white">Rating:</span>
            <span className={`rounded-full px-3 py-1 text-sm font-medium ${ratingColors[review.data.rating]}`}>
              {review.data.rating.replace(/_/g, " ")}
            </span>
          </p>

          <div className="mb-4">
            <h4 className="font-semibold text-gray-900 dark:text-white">Strengths</h4>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-200">
              {review.data.strengths.map((item, index) => <li key={`${index}-${item}`}>{item}</li>)}
            </ul>
          </div>
          <div className="mb-4">
            <h4 className="font-semibold text-gray-900 dark:text-white">Suggested improvements</h4>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-200">
              {review.data.improvements.map((item, index) => <li key={`${index}-${item}`}>{item}</li>)}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">Privacy considerations</h4>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-200">
              {review.data.privacyConsiderations.map((item, index) => <li key={`${index}-${item}`}>{item}</li>)}
            </ul>
          </div>
        </section>
      )}
    </div>
  );
}

export default AiReviewPage;
