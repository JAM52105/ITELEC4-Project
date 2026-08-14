import SubmissionBadge from "../components/SubmissionBadge";
import { sampleClaims, sampleUsers } from "../data/mockData";

function SubmissionsPage() {
  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">My Submissions</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {sampleClaims.map((c) => (
          <SubmissionBadge key={c.id} claim={c} claimedBy={sampleUsers.find((u) => u.id === c.userId)?.name} />
        ))}
      </div>
    </div>
  );
}

export default SubmissionsPage;
