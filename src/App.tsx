import React, { useState, useEffect, useRef } from "react";
import ItemCard from "./components/ItemCard";
import ClaimBadge from "./components/ClaimBadge";
import type { Item, Claim, User } from "./types/index";
import usePrevious from "./hooks/usePrevious";

// sample user (finder)
const finder: User = {
  id: 2,
  name: "Campus Security",
  email: "security@campus.edu",
  role: ("security" as unknown) as any,
  isActive: true,
  score: 0,
};

const sampleItem: Item = {
  id: 1,
  title: "Blue Backpack",
  description: "Navy backpack with a laptop sleeve and stickers",
  location: "Library - 2nd floor",
  foundAt: new Date(),
  foundBy: finder.id,
  status: "found",
};

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const searchRef = useRef<HTMLInputElement>(null);
  const previousSearch = usePrevious<string>(searchTerm);

  useEffect(() => {
    const id = setTimeout(() => {
      setItems([sampleItem]);
      setIsLoading(false);
      searchRef.current?.focus();
    }, 400);
    return () => clearTimeout(id);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  };

  const handleClaim = (item: Item): void => {
    const newClaim: Claim = {
      id: Date.now(),
      itemId: item.id,
      userId: 100, // demo claimant id
      claimedAt: new Date(),
      verified: false,
    };
    setClaims((prev) => [...prev, newClaim]);
    setItems((prev) => prev.map((it) => (it.id === item.id ? { ...it, status: "claimed" } : it)));
  };

  const handleVerify = (claimId: number): void => {
    setClaims((prev) => prev.map((c) => (c.id === claimId ? { ...c, verified: true } : c)));
    const claim = claims.find((c) => c.id === claimId);
    if (claim) {
      setItems((prev) => prev.map((it) => (it.id === claim.itemId ? { ...it, status: "returned" } : it)));
    }
  };

  const filtered = items.filter((it) =>
    (it.title + " " + it.location).toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <p>Loading lost & found items...</p>;

  return (
    <div>
      <h1>Campus Lost & Found Tracker</h1>

      <input
        ref={searchRef}
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search items or locations..."
      />

      {previousSearch !== undefined && previousSearch !== searchTerm && (
        <p>Previous search: "{previousSearch}"</p>
      )}

      <section>
        <h2>Found Items</h2>
        {filtered.length === 0 && <p>No items match your search.</p>}
        {filtered.map((it) => (
          <div key={it.id} style={{ marginBottom: 12 }}>
            <ItemCard item={it} onClaim={handleClaim} />
            <ClaimBadge claim={claims.find((c) => c.itemId === it.id)} onVerify={handleVerify} />
          </div>
        ))}
      </section>
    </div>
  );
}

export default App;
