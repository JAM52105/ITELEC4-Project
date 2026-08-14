import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import type { Item } from "../types/index";
import CourseCard from "../components/CourseCard";
import usePrevious from "../hooks/usePrevious";
import { sampleItems } from "../data/mockData";

function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const previousSearch = usePrevious(searchTerm);

  useEffect(() => {
    const t = setTimeout(() => {
      setItems(sampleItems);
      setIsLoading(false);
      searchInputRef.current?.focus();
    }, 500);
    return () => clearTimeout(t);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => setSearchTerm(e.target.value);

  const filtered = items.filter((c) => c.title.toLowerCase().includes(searchTerm.toLowerCase()) || c.location.toLowerCase().includes(searchTerm.toLowerCase()));

  if (isLoading) return <div className="animate-pulse p-6">Loading items...</div>;
  if (isError) return <div className="rounded-lg bg-red-50 p-4 text-red-700">Could not load items.</div>;

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Items</h2>
      <button onClick={() => setIsError(true)} className="mb-2 rounded bg-red-100 px-2 py-1 text-xs text-red-700">Simulate Error</button>
      <input ref={searchInputRef} value={searchTerm} onChange={handleSearchChange} placeholder="Search items..." className="w-full rounded border border-gray-300 p-2" />
      {previousSearch !== undefined && previousSearch !== searchTerm && (<p className="mt-1 text-sm text-gray-500">Previous search: "{previousSearch}"</p>)}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((it) => (
          <Link key={it.id} to={`/items/${it.id}`}>
            <CourseCard course={it} />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ItemsPage;
