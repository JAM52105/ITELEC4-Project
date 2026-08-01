import type { Item } from "../types/index";

interface ItemCardProps {
  item: Item;
  onClaim: (item: Item) => void;
}

function ItemCard({ item, onClaim }: ItemCardProps) {
  const handleClaim = () => onClaim(item);

  return (
    <div className="item-card">
      <h3>{item.title}</h3>
      <p>{item.description}</p>
      <p>Location: {item.location}</p>
      <p>Found: {item.foundAt.toLocaleString()}</p>
      <p>Status: {item.status}</p>
      {item.status === "found" && <button onClick={handleClaim}>Claim</button>}
    </div>
  );
}

export default ItemCard;
