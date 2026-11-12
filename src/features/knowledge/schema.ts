import { z } from "zod";
import { DOCUMENT_MODULES, SOURCE_TYPES } from "./options";

// What the admin fills in. The form checks these before the file is uploaded.
export const DocumentDetailsSchema = z.object({
  title: z.string().trim().min(1, "Enter a title").max(200),
  module: z.enum(DOCUMENT_MODULES, "Choose a module"),
  sourceType: z.enum(SOURCE_TYPES, "Choose a source type"),
  sourceUrl: z.url("Enter a full link, starting with https://").nullable(),
});

// The full row: the details plus where the uploaded file ended up.
export const DocumentSchema = DocumentDetailsSchema.extend({
  fileName: z.string().min(1).max(255),
  blobUrl: z.url(),
});

export type DocumentDetailsInput = z.infer<typeof DocumentDetailsSchema>;
export type DocumentInput = z.infer<typeof DocumentSchema>;
