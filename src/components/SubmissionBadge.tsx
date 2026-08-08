import type { Claim } from "../types/index";

interface SubmissionBadgeProps {
  claim: Claim;
  claimedBy?: string;
  onVerify?: (claimId: number) => void;
  isDarkMode?: boolean;
}

const SubmissionBadge = ({ claim, claimedBy, onVerify, isDarkMode = false }: SubmissionBadgeProps) => {
  return (
    <div className={`rounded-lg border p-4 shadow-sm ${isDarkMode ? "border-slate-700 bg-slate-900" : "border-gray-200 bg-slate-50"}`}>
      <p className="text-sm text-slate-700 dark:text-slate-200">Claimed by: {claimedBy ?? claim.userId}</p>
      <p className="text-sm text-slate-700 dark:text-slate-200">Claimed at: {claim.claimedAt.toLocaleString()}</p>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">
        Verified: {claim.verified ? "Yes" : "No"}
      </p>
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
