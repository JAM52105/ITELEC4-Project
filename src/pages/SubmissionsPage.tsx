import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ApiClaim } from "../types/index";
import SubmissionBadge from "../components/SubmissionBadge";
import { fetchClaims, createClaim } from "../api/client";
import { sampleUsers } from "../data/mockData";
import { claimSchema, type ClaimFormValues } from "../schemas/claimSchema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

function SubmissionsPage() {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClaimFormValues>({
    resolver: zodResolver(claimSchema),
    defaultValues: { itemId: "" },
  });

  // 1. READ
  const { data, isPending, isError } = useQuery<ApiClaim[]>({
    queryKey: ["claims"],
    queryFn: fetchClaims,
  });

  // 2. WRITE -- mutationFn does the POST, onSuccess cleans up after it
  const addClaim = useMutation({
    mutationFn: createClaim,
    onSuccess: () => {
      // "the claims list is out of date now -- go and refetch it"
      queryClient.invalidateQueries({ queryKey: ["claims"] });
      reset();
    },
  });

  const onSubmit = (values: ClaimFormValues): void => {
    addClaim.mutate({
      itemId: Number(values.itemId),
      userId: 1,
      claimedAt: new Date().toISOString(),
      verified: false,
    });
  };

  if (isPending) {
    return <div className="animate-pulse p-6">Loading submissions...</div>;
  }

  if (isError) {
    return <div className="rounded-lg bg-red-50 p-4 text-red-700">Could not load submissions.</div>;
  }

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">My Submissions</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="mb-6 flex flex-wrap items-start gap-2" noValidate>
        <div className="flex-1">
          <Label htmlFor="itemId" className="mb-1">
            Item ID to claim
          </Label>
          <Input id="itemId" placeholder="Item ID to claim" {...register("itemId")} />
          {errors.itemId && <p className="mt-1 text-sm text-red-700">{errors.itemId.message}</p>}
        </div>
        <Button type="submit" disabled={addClaim.isPending} className="mt-6">
          {addClaim.isPending ? "Saving..." : "Add"}
        </Button>
      </form>

      {addClaim.isError && <p className="mb-4 text-sm text-red-700">{addClaim.error.message}</p>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {data.map((c) => (
          <SubmissionBadge key={c.id} claim={c} claimedBy={sampleUsers.find((u) => u.id === c.userId)?.name} />
        ))}
      </div>
    </div>
  );
}

export default SubmissionsPage;
