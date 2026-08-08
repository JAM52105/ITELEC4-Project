import type { Claim } from "../types/index";

interface ClaimBadgeProps {
  claim?: Claim;
  onVerify?: (claimId: number) => void;
}

function ClaimBadge({ claim, onVerify }: ClaimBadgeProps) {
  if (!claim) return null;

  const handleVerify = () => {
    onVerify?.(claim.id);
  };

  return (
    <div className="mt-2 rounded border border-gray-100 bg-slate-50 p-3 text-sm dark:bg-slate-800 dark:border-gray-600">
      <p className="text-slate-700 dark:text-slate-200">Claimed by: {claim.userId}</p>
      <p className="text-slate-600 dark:text-slate-200">At: {claim.claimedAt.toLocaleString()}</p>
      <p className="text-slate-600 dark:text-slate-200">Verified: {claim.verified ? "Yes" : "No"}</p>
      {!claim.verified && (
        <button
          onClick={handleVerify}
          className="mt-2 rounded bg-blue-600 px-2 py-1 text-xs font-medium text-white hover:bg-blue-700"
        >
          Verify (admin)
        </button>
      )}
    </div>
  );
}

export default ClaimBadge;
