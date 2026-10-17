import { useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router";
import type { ApiItem, NewItem } from "../types/index";
import CourseCard from "../components/CourseCard";
import usePrevious from "../hooks/usePrevious";
import useUiStore from "../store/uiStore";
import { createItem, fetchItems } from "../api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const categories: ApiItem["category"][] = [
  "electronics",
  "clothing",
  "accessories",
  "books",
  "other",
];

function ItemsPage() {
  const queryClient = useQueryClient();
  const { data, isPending, isError, error } = useQuery<ApiItem[]>({
    queryKey: ["items"],
    queryFn: fetchItems,
  });
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState<ApiItem["category"]>("other");
  const [estimatedValue, setEstimatedValue] = useState("");
  const searchTerm = useUiStore((state) => state.searchTerm);
  const setSearchTerm = useUiStore((state) => state.setSearchTerm);
  const previousSearch = usePrevious(searchTerm);

  const addItem = useMutation({
    mutationFn: (item: NewItem) => createItem(item),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["items"] });
      setTitle("");
      setDescription("");
      setLocation("");
      setCategory("other");
      setEstimatedValue("");
    },
  });

  const handleCreateItem = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    addItem.mutate({
      title: title.trim(),
      ...(description.trim() ? { description: description.trim() } : {}),
      location: location.trim(),
      category,
      estimatedValue: Number(estimatedValue),
    });
  };

  const filtered = (data ?? []).filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Items</h2>

      <form
        onSubmit={handleCreateItem}
        className="mb-8 grid max-w-2xl grid-cols-1 gap-3 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:grid-cols-2"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white sm:col-span-2">
          Add a found item
        </h3>
        <div>
          <Label htmlFor="item-title" className="mb-1">Item name</Label>
          <Input
            id="item-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={120}
            required
          />
        </div>
        <div>
          <Label htmlFor="item-location" className="mb-1">Found location</Label>
          <Input
            id="item-location"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            maxLength={200}
            required
          />
        </div>
        <div>
          <Label htmlFor="item-category" className="mb-1">Category</Label>
          <select
            id="item-category"
            value={category}
            onChange={(event) => setCategory(event.target.value as ApiItem["category"])}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          >
            {categories.map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="item-value" className="mb-1">Estimated value</Label>
          <Input
            id="item-value"
            type="number"
            min="0"
            max="10000"
            step="0.01"
            value={estimatedValue}
            onChange={(event) => setEstimatedValue(event.target.value)}
            required
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="item-description" className="mb-1">Description (optional)</Label>
          <textarea
            id="item-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            maxLength={2000}
            rows={3}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          />
        </div>
        {addItem.isError && (
          <p role="alert" className="text-sm text-red-700 sm:col-span-2">
            {addItem.error.message}
          </p>
        )}
        <div className="sm:col-span-2">
          <Button type="submit" disabled={addItem.isPending}>
            {addItem.isPending ? "Adding item..." : "Add item"}
          </Button>
        </div>
      </form>

      <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">My items</h3>
      {isPending ? (
        <div className="animate-pulse p-6">Loading items...</div>
      ) : isError ? (
        <div role="alert" className="rounded-lg bg-red-50 p-4 text-red-700">
          {error.message}
        </div>
      ) : (
        <>
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search items..."
            className="w-full rounded border border-gray-300 p-2"
          />
          {previousSearch !== undefined && previousSearch !== searchTerm && (
            <p className="mt-1 text-sm text-gray-500">
              Previous search: "{previousSearch}"
            </p>
          )}

          {filtered.length === 0 ? (
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
              {data.length === 0
                ? "You have not added any items yet."
                : "No items match your search."}
            </p>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((item) => (
                <Link key={item.id} to={`/items/${item.id}`}>
                  <CourseCard course={item} />
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ItemsPage;
