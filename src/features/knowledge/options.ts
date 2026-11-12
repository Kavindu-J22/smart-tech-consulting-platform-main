import { MODULES, MODULE_LABELS } from "@/features/company/options";

// Never rename an id: it is stored in the database.

// A document belongs to one module, or to all of them ("shared").
export const DOCUMENT_MODULES = [...MODULES, "shared"] as const;

export const DOCUMENT_MODULE_LABELS: Record<string, string> = {
  ...MODULE_LABELS,
  shared: "Shared (all modules)",
};

export const SOURCE_TYPES = ["peer_reviewed", "government", "provider", "other"] as const;

export const SOURCE_TYPE_LABELS: Record<string, string> = {
  peer_reviewed: "Peer-reviewed",
  government: "Government",
  provider: "Provider",
  other: "Other",
};

export const STATUS_LABELS: Record<string, string> = {
  uploaded: "Uploaded",
  processed: "Processed",
};

// The upload form and the upload route both read these, so the limits live in one place.
// Keyed by file extension, because browsers often send .md files with no content type.
export const FILE_TYPES: Record<string, string> = {
  pdf: "application/pdf",
  md: "text/markdown",
  txt: "text/plain",
};

export const MAX_FILE_MB = 50;
