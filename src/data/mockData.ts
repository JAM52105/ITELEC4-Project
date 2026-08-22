import type { User } from "../types/index";
import { Role } from "../types/index";

// sampleItems and sampleClaims are DELETED. They live in db.json now,
// and the app fetches them instead of importing them.
//
// sampleUsers stays. There is no /users endpoint and no real login until
// Module 4 -- the Dashboard's users are still hard-coded, on purpose.
export const sampleUsers: User[] = [
  { id: 1, name: "Juan dela Cruz", email: "juan@example.com", role: Role.Student, isActive: true, score: 94 },
  { id: 2, name: "Campus Security", email: "security@campus.edu", role: Role.Security, isActive: true, score: 78 },
];
