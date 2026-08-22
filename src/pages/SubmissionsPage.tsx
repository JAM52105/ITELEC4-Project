import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ApiClaim } from "../types/index";
import SubmissionBadge from "../components/SubmissionBadge";
import { fetchClaims, createClaim } from "../api/client";
import { sampleUsers } from "../data/mockData";

function SubmissionsPage() {
  // Local, because only this one form reads it. Not store material.
  const [itemId, setItemId] = useState<string>("");
  const queryClient = useQueryClient();

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
      setItemId("");
    },
  });

  const handleAdd = (): void => {
    addClaim.mutate({
      itemId: Number(itemId),
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

      <div className="mb-6 flex gap-2">
        <input
          value={itemId}
          onChange={(e) => setItemId(e.target.value)}
          placeholder="Item ID to claim"
          className="w-full rounded border border-gray-300 p-2"
        />
        <button
          onClick={handleAdd}
          disabled={itemId === "" || addClaim.isPending}
          className="rounded bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:bg-gray-400"
        >
          {addClaim.isPending ? "Saving..." : "Add"}
        </button>
      </div>

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
