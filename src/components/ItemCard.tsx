import type { Item } from "../types/index";

interface ItemCardProps {
  item: Item;
  onClaim: (item: Item) => void;
}

function ItemCard({ item, onClaim }: ItemCardProps) {
  const handleClaim = () => onClaim(item);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <h3 className="font-bold text-gray-900 dark:text-white">{item.title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
      <p className="text-sm text-gray-500 dark:text-gray-300">Location: {item.location}</p>
      <p className="text-xs text-gray-400 dark:text-gray-300">Found: {item.foundAt.toLocaleString()}</p>
      <p className="mt-2 text-sm text-gray-700 dark:text-gray-200">Status: <span className="font-medium">{item.status}</span></p>
      {item.status === "found" && (
        <button
          onClick={handleClaim}
          className="mt-3 rounded bg-green-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-green-700"
        >
          Claim
        </button>
      )}
    </div>
  );
}

export default ItemCard;
