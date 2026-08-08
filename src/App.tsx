import React, { useEffect, useRef, useState } from "react";
import type { Claim, Item, User } from "./types/index";
import { Role } from "./types/index";
import CourseCard from "./components/CourseCard";
import SubmissionBadge from "./components/SubmissionBadge";
import UserCard from "./components/UserCard";
import usePrevious from "./hooks/usePrevious";
import useToggle from "./hooks/useToggle";

const sampleUsers: User[] = [
  {
    id: 1,
    name: "Juan dela Cruz",
    email: "juan@example.com",
    role: Role.Student,
    isActive: true,
    score: 94,
  },
  {
    id: 2,
    name: "Campus Security",
    email: "security@campus.edu",
    role: Role.Security,
    isActive: true,
    score: 78,
  },
  {
    id: 3,
    name: "Maria Lopez",
    email: "maria@school.edu",
    role: Role.Student,
    isActive: true,
    score: 88,
  },
];

const sampleItems: Item[] = [
  {
    id: 101,
    title: "Blue Backpack",
    description: "Navy backpack with a laptop sleeve and stickers",
    location: "Library - 2nd floor",
    foundAt: new Date("2026-07-28T11:20:00"),
    foundBy: 2,
    status: "found",
  },
  {
    id: 102,
    title: "Silver MacBook",
    description: "MacBook Air with a black keyboard cover",
    location: "Cafeteria",
    foundAt: new Date("2026-07-27T16:45:00"),
    foundBy: 2,
    status: "found",
  },
  {
    id: 103,
    title: "Red Umbrella",
    description: "Foldable umbrella with a wooden handle",
    location: "Lecture Hall B",
    foundAt: new Date("2026-07-26T09:15:00"),
    foundBy: 3,
    status: "claimed",
  },
];

const sampleClaims: Claim[] = [
  {
    id: 1,
    itemId: 103,
    userId: 1,
    claimedAt: new Date("2026-07-28T14:00:00"),
    verified: false,
  },
];

function App() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isDarkMode, toggleDarkMode] = useToggle(false);
  const [isCompact, toggleCompact] = useToggle(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const previousSearch = usePrevious(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setItems(sampleItems);
      setClaims(sampleClaims);
      setIsLoading(false);
      searchInputRef.current?.focus();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
    }
  }, [isDarkMode]);

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  };

  const handleClaim = (item: Item): void => {
    if (!selectedUser) {
      alert("Please select a user before claiming an item.");
      return;
    }

    const newClaim: Claim = {
      id: Date.now(),
      itemId: item.id,
      userId: selectedUser.id,
      claimedAt: new Date(),
      verified: false,
    };

    setClaims((prev) => [...prev, newClaim]);
    setItems((prev) =>
      prev.map((it) => (it.id === item.id ? { ...it, status: "claimed" } : it))
    );
  };

  const handleVerify = (claimId: number): void => {
    setClaims((prev) => prev.map((claim) => (claim.id === claimId ? { ...claim, verified: true } : claim)));
    const claim = claims.find((c) => c.id === claimId);
    if (claim) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === claim.itemId ? { ...item, status: "returned" } : item
        )
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <div className="p-6">
          <div className="animate-pulse rounded-3xl border border-gray-200 bg-white/80 p-8 shadow-lg shadow-slate-200/50 dark:border-slate-700 dark:bg-slate-900/80">
            Loading lost &amp; found data...
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={isDarkMode ? "dark bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"}>
        <div className="min-h-screen p-6">
          <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-red-800 shadow-lg shadow-red-100 dark:border-red-700 dark:bg-red-950/40 dark:text-red-200">
            Could not load campus lost &amp; found data. Please refresh.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={isDarkMode ? "dark bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"}>
      <div className="min-h-screen p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <header className="rounded-3xl border border-gray-200 bg-white p-6 shadow-lg shadow-slate-200/40 dark:border-slate-700 dark:bg-slate-950 dark:shadow-slate-950/40">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">Campus Lost &amp; Found Tracker</h1>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Select a user, search found items, claim an item, and verify claims.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={toggleDarkMode}
                  className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-200"
                >
                  {isDarkMode ? "Light Mode" : "Dark Mode"}
                </button>
                <button
                  type="button"
                  onClick={toggleCompact}
                  className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  {isCompact ? "Default Cards" : "Compact Cards"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsError(true)}
                  className="rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-200 dark:bg-red-900/40 dark:text-red-200 dark:hover:bg-red-900"
                >
                  Simulate Error
                </button>
              </div>
            </div>
          </header>

          <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-lg shadow-slate-200/40 dark:border-slate-700 dark:bg-slate-950 dark:shadow-slate-950/40">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Search found items</h2>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                {previousSearch !== undefined && previousSearch !== searchTerm && (
                  <span>
                    Previous search: <span className="font-semibold text-slate-900 dark:text-slate-100">{previousSearch}</span>
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input
                ref={searchInputRef}
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search title, location, or description..."
                className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-blue-400 dark:focus:ring-blue-500/20"
              />
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-lg shadow-slate-200/40 dark:border-slate-700 dark:bg-slate-950 dark:shadow-slate-950/40">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Users</h2>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {sampleUsers.length}
                </span>
              </div>
              <div className="space-y-4">
                {sampleUsers.map((user) => (
                  <UserCard
                    key={user.id}
                    user={user}
                    onSelect={setSelectedUser}
                    isSelected={selectedUser?.id === user.id}
                    isDarkMode={isDarkMode}
                  />
                ))}
              </div>
              {selectedUser && (
                <div className="rounded-2xl bg-blue-50 p-4 text-sm text-slate-900 dark:bg-blue-950/40 dark:text-blue-100">
                  Selected user: <span className="font-semibold">{selectedUser.name}</span>
                </div>
              )}
            </div>

            <div className="lg:col-span-2 space-y-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-lg shadow-slate-200/40 dark:border-slate-700 dark:bg-slate-950 dark:shadow-slate-950/40">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Found items</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Showing {filteredItems.length} items.</p>
                </div>
                <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {isCompact ? "Compact" : "Default"}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {filteredItems.map((item) => (
                  <CourseCard
                    key={item.id}
                    course={item}
                    variant={isCompact ? "compact" : "default"}
                    onClaim={handleClaim}
                    isDarkMode={isDarkMode}
                  />
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-lg shadow-slate-200/40 dark:border-slate-700 dark:bg-slate-950 dark:shadow-slate-950/40">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Claims</h2>
              <span className="text-sm text-slate-500 dark:text-slate-400">{claims.length} total</span>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {claims.map((claim) => {
                const claimer = sampleUsers.find((user) => user.id === claim.userId);
                return (
                  <SubmissionBadge
                    key={claim.id}
                    claim={claim}
                    claimedBy={claimer?.name ?? "Unknown"}
                    onVerify={handleVerify}
                    isDarkMode={isDarkMode}
                  />
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default App;
