import type { ApiClaim } from "../types/index";

interface SubmissionBadgeProps {
  claim: ApiClaim;
  claimedBy?: string;
  onVerify?: (claimId: string) => void;
  isDarkMode?: boolean;
}

const SubmissionBadge = ({ claim, claimedBy, onVerify }: SubmissionBadgeProps) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <p className="text-sm text-slate-900 dark:text-slate-100">Claimed by: {claimedBy ?? claim.userId}</p>
      <p className="text-sm text-slate-700 dark:text-slate-300">Claimed at: {new Date(claim.claimedAt).toLocaleString()}</p>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">Verified: {claim.verified ? "Yes" : "No"}</p>
      {!claim.verified && (
        <button
          type="button"
          onClick={() => onVerify?.(claim.id)}
          className="mt-3 rounded bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Verify claim
        </button>
      )}
    </div>
  );
};

export default SubmissionBadge;
