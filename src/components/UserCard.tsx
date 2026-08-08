import type { User } from "../types/index";

interface UserCardProps {
  user: User;
  onSelect: (user: User) => void;
  isSelected?: boolean;
  isDarkMode?: boolean;
}

function UserCard({ user, onSelect, isSelected = false, isDarkMode = false }: UserCardProps) {
  const handleClick = () => {
    onSelect(user);
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    console.log("Note:", e.target.value);
  };

  return (
    <div
      onClick={handleClick}
      className={`rounded-lg border ${isDarkMode ? "bg-slate-900 border-slate-700" : "bg-slate-50 border-gray-200 hover:border-gray-300"} p-5 shadow-sm transition-all ${
        isSelected
          ? "border-blue-500 ring-2 ring-blue-500/30"
          : "border-gray-200 hover:border-gray-300 dark:border-slate-700"
      }`}
    >
      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{user.name}</h3>
      <p className="text-slate-600 dark:text-slate-300">{user.email}</p>
      <p className="text-sm text-slate-500 dark:text-slate-400">Role: {user.role}</p>
      <button
        onClick={handleClick}
        className="mt-3 rounded bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-blue-700"
      >
        Select
      </button>
      <input
        onChange={handleNoteChange}
        placeholder="Quick note (demo only)"
        className="mt-2 w-full rounded border border-gray-300 px-2 py-1 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      />
    </div>
  );
}

export default UserCard;
