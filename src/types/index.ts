// ===== ENUMS =====
export const enum Role {
  Student = "student",
  Admin = "admin",
  Instructor = "instructor",
  Security = "security",
}

// ===== INTERFACES =====
export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
  score: number;
}

export interface Course {
  code: string;
  title: string;
  units: number;
  semester: string;
}

export interface Submission {
  id: number;
  studentId: number;
  courseCode: string;
  repoUrl: string;
  submittedAt: Date;
  score?: number;
}

export interface Item {
  id: number;
  title: string;
  description?: string;
  location: string;
  foundAt: Date;
  foundBy: number; // user id
  status: "found" | "claimed" | "returned";
}

export interface Claim {
  id: number;
  itemId: number;
  userId: number;
  claimedAt: Date;
  verified: boolean;
}

// ===== TYPE ALIASES =====
export type ID = number | string;
export type Coordinate = {
  x: number;
  y: number;
};
export type Formatter = (value: number) => string;
export type StringOrNumber = string | number;
export type Status = "pending" | "active" | "inactive";

// ===== UNION TYPES =====
export function printId(id: StringOrNumber): void {
  console.log(`ID: ${id}`);
}

// ===== INTERSECTION TYPES =====
export type StudentWithCourse = User & {
  enrolledCourse: Course;
  gpa: number;
};

// ===== GENERIC INTERFACE =====
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// ===== UTILITY TYPES =====
export type UserUpdate = Partial<User>;
export type UserPreview = Pick<User, "id" | "name" | "role">;
export type PublicUser = Omit<User, "email" | "isActive">;
export type RoleCount = Record<"student" | "admin" | "instructor", number>;

// ===== ENUMS =====
export enum SubmissionStatus {
  Pending,
  Graded,
  Late,
}

// ===== EXAMPLE VALUES =====
export const studentId: ID = "S2026-001";
export const position: Coordinate = { x: 10, y: 20 };
export const formatScore: Formatter = (value) => `${value}%`;
export const topStudent: StudentWithCourse = {
  id: 1,
  name: "Maria Santos",
  email: "m@example.com",
  role: Role.Student,
  isActive: true,
  score: 97,
  enrolledCourse: { code: "ITELECT4", title: "IT Elective 4", units: 3, semester: "1st Semester 2026-2027" },
  gpa: 1.25,
};

printId(101);
printId("S2026-001");

// ===== API TYPES (Session 7) =====
// JSON has no Date, and json-server writes ids as strings. So what the
// API hands back is NOT the Item/Claim shape declared above. Both types
// below are DERIVED from those, so Item/Claim stay the single source of
// truth -- add a field there and these two inherit it.
export type ApiItem = Omit<Item, "id" | "foundAt"> & {
  id: string; // json-server ids look like "z4U3v8og06g"
  foundAt: string; // an ISO string, never a Date object
};

export type ApiClaim = Omit<Claim, "id" | "claimedAt"> & {
  id: string;
  claimedAt: string;
};

// What we SEND when creating one. No id yet -- the server makes it.
export type NewClaim = Omit<ApiClaim, "id">;
