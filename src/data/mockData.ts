import type { User, Item, Claim } from "../types/index";
import { Role } from "../types/index";

export const sampleUsers: User[] = [
  { id: 1, name: "Juan dela Cruz", email: "juan@example.com", role: Role.Student, isActive: true, score: 94 },
  { id: 2, name: "Campus Security", email: "security@campus.edu", role: Role.Security, isActive: true, score: 78 },
];

export const sampleItems: Item[] = [
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

export const sampleClaims: Claim[] = [
  { id: 1, itemId: 103, userId: 1, claimedAt: new Date("2026-07-28T14:00:00"), verified: false },
];
