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
    <div className="claim-badge">
      <p>Claimed by: {claim.userId}</p>
      <p>At: {claim.claimedAt.toLocaleString()}</p>
      <p>Verified: {claim.verified ? "Yes" : "No"}</p>
      {!claim.verified && (
        <button onClick={handleVerify}>Verify (admin)</button>
      )}
    </div>
  );
}

export default ClaimBadge;
