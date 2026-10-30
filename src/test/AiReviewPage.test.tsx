import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import AiReviewPage from "../pages/AiReviewPage";

describe("AI Review form", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shows the prompt validation message without sending a request", async () => {
    const user = userEvent.setup();
    const fetchSpy = vi.spyOn(globalThis, "fetch");

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <AiReviewPage />
      </QueryClientProvider>,
    );

    await user.type(screen.getByLabelText("Project description"), "short");
    await user.click(screen.getByRole("button", { name: "Submit for review" }));

    expect(await screen.findByText("Enter at least 20 characters.")).toBeInTheDocument();
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
