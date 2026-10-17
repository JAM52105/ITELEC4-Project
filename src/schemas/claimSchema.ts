import { z } from "zod";

export const claimSchema = z.object({
  itemId: z
    .string()
    .trim()
    .min(1, "Item ID is required")
    .refine(
      (value) =>
        (/^\d+$/.test(value) && Number(value) > 0) ||
        /^[a-f\d]{24}$/i.test(value),
      "Enter a valid item ID",
    ),
});

export type ClaimFormValues = z.infer<typeof claimSchema>;
