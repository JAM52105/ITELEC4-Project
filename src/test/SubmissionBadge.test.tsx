import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SubmissionBadge from "../components/SubmissionBadge";
import type { ApiClaim } from "../types/index";

describe("SubmissionBadge", () => {
  it("shows that a claim has not been verified", () => {
    const claim: ApiClaim = {
      id: "claim-123",
      userId: "student-123",
      itemId: "item-123",
      claimedAt: "2026-10-30T12:00:00.000Z",
      verified: false,
    };

    render(<SubmissionBadge claim={claim} />);

    expect(screen.getByText("Verified: No")).toBeInTheDocument();
  });
});
