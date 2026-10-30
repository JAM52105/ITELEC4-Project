import type {
  ApiClaim,
  ApiCourse,
  ApiItem,
  AiReply,
  ApiSubmission,
  AuthResponse,
  NewClaim,
  NewItem,
  NewSubmission,
  RegisterInput,
} from "../types/index";
import useAuthStore from "../store/authStore";

export const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:4000/api").replace(
  /\/+$/,
  "",
);

async function request<T>(
  path: string,
  options: RequestInit = {},
  authenticated = false,
): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  if (authenticated) {
    const token = useAuthStore.getState().token;
    if (!token) {
      throw new Error("Please log in to continue.");
    }
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (response.status === 204) {
    return undefined as T;
  }

  const payload: unknown = await response.json();
  if (!response.ok) {
    const message =
      typeof payload === "object" &&
      payload !== null &&
      "message" in payload &&
      typeof payload.message === "string"
        ? payload.message
        : `Request failed with status ${response.status}.`;
    throw new Error(message);
  }

  return payload as T;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const result = await request<{ token: string; user: { name: string } }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  return { token: result.token, userName: result.user.name };
}

export async function register(input: RegisterInput): Promise<void> {
  await request("/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function fetchItems(): Promise<ApiItem[]> {
  const result = await request<{ items: ApiItem[] }>("/items", {}, true);
  return result.items;
}

export async function fetchItemById(id: string): Promise<ApiItem> {
  const result = await request<{ item: ApiItem }>(`/items/${encodeURIComponent(id)}`, {}, true);
  return result.item;
}

export async function createItem(input: NewItem): Promise<ApiItem> {
  const result = await request<{ item: ApiItem }>(
    "/items",
    { method: "POST", body: JSON.stringify(input) },
    true,
  );
  return result.item;
}

export async function fetchClaims(): Promise<ApiClaim[]> {
  const result = await request<{ claims: ApiClaim[] }>("/claims", {}, true);
  return result.claims;
}

export async function createClaim(newClaim: NewClaim): Promise<ApiClaim> {
  const result = await request<{ claim: ApiClaim }>(
    "/claims",
    { method: "POST", body: JSON.stringify(newClaim) },
    true,
  );
  return result.claim;
}

export async function fetchCourses(): Promise<ApiCourse[]> {
  const result = await request<{ courses: ApiCourse[] }>("/courses");
  return result.courses;
}

export async function fetchCourseByCode(code: string): Promise<ApiCourse> {
  const result = await request<{ course: ApiCourse }>(
    `/courses/${encodeURIComponent(code)}`,
  );
  return result.course;
}

export async function fetchSubmissions(): Promise<ApiSubmission[]> {
  const result = await request<{ submissions: ApiSubmission[] }>("/submissions", {}, true);
  return result.submissions;
}

export async function createSubmission(input: NewSubmission): Promise<ApiSubmission> {
  const result = await request<{ submission: ApiSubmission }>(
    "/submissions",
    { method: "POST", body: JSON.stringify(input) },
    true,
  );
  return result.submission;
}

export async function askAi(prompt: string): Promise<AiReply> {
  return request<AiReply>(
    "/ai",
    { method: "POST", body: JSON.stringify({ prompt }) },
    true,
  );
}
