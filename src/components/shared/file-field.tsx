"use client";
import { useRef, useState } from "react";
import { FileText, Upload, X } from "lucide-react";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { AppButton } from "@/components/shared/app-button";
import { cn } from "@/lib/utils";

// A labelled drop zone for one file: drag a file onto it, or click it to browse. Once a file is
// chosen it turns into a file card with a remove button and, while uploading, a progress bar.
// The real <input type="file"> is visually hidden but always mounted, in both states, so the
// label always points at it and keyboard focus never falls off the page when the zone swaps
// for the file card.
type Props = {
  id: string;
  label: string;
  hint: string;
  accept: string;
  file: File | null;
  onChange: (file: File | null) => void;
  // 0 to 100 while the file uploads, null otherwise.
  progress: number | null;
  error?: { message?: string };
};

export function FileField({ id, label, hint, accept, file, onChange, progress, error }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const isUploading = progress !== null;

  return (
    <Field data-invalid={!!error}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>

      <div className="rounded-lg has-[input:focus-visible]:ring-3 has-[input:focus-visible]:ring-ring/50">
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={accept}
          aria-invalid={!!error}
          aria-describedby={`${id}-hint`}
          className="peer sr-only"
          disabled={isUploading}
          onChange={(event) => {
            onChange(event.target.files?.[0] ?? null);
            // Cleared so choosing the same file again (after removing it) still fires onChange.
            event.target.value = "";
          }}
        />

        {file ? (
          <div
            className={cn(
              "flex flex-col gap-3 rounded-lg border border-neutral-550 bg-background px-4 py-3 peer-focus-visible:border-ring",
              error && "border-destructive",
            )}
          >
            <div className="flex items-center gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-neutral-100">
                <FileText
                  aria-hidden="true"
                  className="size-5 text-neutral-700"
                  strokeWidth={1.5}
                />
              </span>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate font-medium text-neutral-900">{file.name}</span>
                <span className="text-sm text-neutral-600" aria-live="polite">
                  {/* At 100% the file is in, but the form may still be saving its details. */}
                  {!isUploading && formatSize(file.size)}
                  {isUploading && (progress < 100 ? `Uploading… ${progress}%` : "Saving…")}
                </span>
              </div>
              <AppButton
                type="button"
                variant="ghost"
                className="size-11 shrink-0 px-0"
                aria-label={`Remove ${file.name}`}
                disabled={isUploading}
                onClick={() => {
                  onChange(null);
                  // The button is about to disappear; send focus back to the file input.
                  inputRef.current?.focus();
                }}
              >
                <X aria-hidden="true" className="size-5" strokeWidth={1.5} />
              </AppButton>
            </div>
            {isUploading && (
              <div
                role="progressbar"
                aria-label={`Uploading ${file.name}`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
                className="h-1.5 overflow-hidden rounded-full bg-neutral-200"
              >
                <div
                  className="h-full rounded-full bg-neutral-900 transition-[width] duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>
        ) : (
          <label
            htmlFor={id}
            onDragOver={(event) => {
              // Without preventDefault the browser opens the dropped file instead of handing it over.
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={(event) => {
              // dragleave also fires when moving over the icon or text inside the zone; ignore those.
              if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
              setIsDragging(false);
            }}
            onDrop={(event) => {
              event.preventDefault();
              setIsDragging(false);
              onChange(event.dataTransfer.files[0] ?? null);
            }}
            className={cn(
              "flex cursor-pointer flex-col items-center gap-3 rounded-lg border border-dashed border-neutral-550 bg-background px-4 py-10 text-center transition-colors peer-focus-visible:border-ring hover:border-neutral-600 hover:bg-neutral-50",
              isDragging && "border-solid border-ring bg-lilac-50 hover:bg-lilac-50",
              error && "border-destructive",
            )}
          >
            <span className="flex size-11 items-center justify-center rounded-lg bg-neutral-100">
              <Upload aria-hidden="true" className="size-5 text-neutral-700" strokeWidth={1.5} />
            </span>
            <span className="text-base text-neutral-900">
              {isDragging ? (
                "Drop the file here"
              ) : (
                <>
                  Drag a file here or <span className="font-medium underline">browse</span>
                </>
              )}
            </span>
          </label>
        )}
      </div>

      <FieldDescription id={`${id}-hint`}>{hint}</FieldDescription>
      <FieldError errors={[error]} />
    </Field>
  );
}

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
