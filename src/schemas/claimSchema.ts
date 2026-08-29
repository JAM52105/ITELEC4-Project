import { z } from "zod";

// Claim form (Submissions page) -- the item id the student types in to
// claim a found item. Rules: required, digits only, and a refine so
// "0" (a syntactically valid but meaningless id) is rejected too.
export const claimSchema = z
  .object({
    itemId: z
      .string()
      .min(1, "Item ID is required")
      .regex(/^\d+$/, "Item ID must contain only digits"),
  })
  .refine((data) => Number(data.itemId) > 0, {
    message: "Item ID must be greater than 0",
    path: ["itemId"],
  });

export type ClaimFormValues = z.infer<typeof claimSchema>;
