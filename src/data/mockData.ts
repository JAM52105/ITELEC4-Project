import type { User } from "../types/index";
import { Role } from "../types/index";

// Dashboard examples remain static; auth and item, claim, course, and
// submission data are loaded from the backend API.
export const sampleUsers: User[] = [
  { id: 1, name: "Juan dela Cruz", email: "juan@example.com", role: Role.Student, isActive: true, score: 94 },
  { id: 2, name: "Campus Security", email: "security@campus.edu", role: Role.Security, isActive: true, score: 78 },
];
