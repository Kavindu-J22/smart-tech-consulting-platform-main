import { z } from "zod";
import { GEOGRAPHIC_FOCUSES, OPERATING_MODES, PRODUCT_TYPES, STAGES } from "./options";

export const CompanySchema = z.object({
  name: z.string().trim().min(1, "Enter a company name").max(100),
  stage: z.enum(STAGES, "Choose a stage"),
  productType: z.enum(PRODUCT_TYPES, "Choose a product type"),
  operatingMode: z.enum(OPERATING_MODES, "Choose how the team works"),
  // Optional fields are null when empty, so clearing one on edit also clears it in the database.
  industry: z.string().trim().max(100).nullable(),
  geographicFocus: z.enum(GEOGRAPHIC_FOCUSES).nullable(),
  budgetLkr: z
    .number("Enter a whole number")
    .int("Enter a whole number")
    .min(0, "Enter 0 or more")
    .nullable(),
});

export type CompanyInput = z.infer<typeof CompanySchema>;
