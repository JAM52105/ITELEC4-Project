import type { ApiItem } from "../types/index";

interface CourseCardProps {
  course: ApiItem;
  variant?: "default" | "compact";
  onClaim?: (item: ApiItem) => void;
  isDarkMode?: boolean;
}

function CourseCard({ course, variant = "default", onClaim }: CourseCardProps) {
  const isCompact = variant === "compact";
  const isClaimable = course.status === "found" && typeof onClaim === "function";

  return (
    <div className={`rounded-lg border bg-white dark:bg-slate-900 dark:border-slate-700 shadow-sm ${isCompact ? "p-3" : "p-5"}`}>
      <h3 className={`font-bold text-slate-900 dark:text-white ${isCompact ? "text-sm" : "text-lg"}`}>
        {course.title}
      </h3>
      {!isCompact && <p className="text-slate-600 dark:text-slate-300">{course.description}</p>}
      <p className="text-sm text-slate-500 dark:text-slate-400">Location: {course.location}</p>
      <p className="text-sm text-slate-500 dark:text-slate-400">Status: {course.status}</p>
      {isClaimable && (
        <button type="button" onClick={() => onClaim?.(course)} className="mt-3 rounded bg-green-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-green-700">
          Claim item
        </button>
      )}
      {isCompact && <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Found: {new Date(course.foundAt).toLocaleDateString()}</p>}
    </div>
  );
}

export default CourseCard;
