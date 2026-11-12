"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { upload } from "@vercel/blob/client";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { FieldGroup } from "@/components/ui/field";
import { AppButton } from "@/components/shared/app-button";
import { ChoiceField } from "@/components/shared/choice-field";
import { FileField } from "@/components/shared/file-field";
import { FormPanel } from "@/components/shared/form-panel";
import { TextField } from "@/components/shared/text-field";
import {
  DOCUMENT_MODULES,
  DOCUMENT_MODULE_LABELS,
  FILE_TYPES,
  MAX_FILE_MB,
  SOURCE_TYPES,
  SOURCE_TYPE_LABELS,
} from "@/features/knowledge/options";
import { DocumentDetailsSchema, type DocumentDetailsInput } from "@/features/knowledge/schema";
import { createDocumentAction } from "@/features/knowledge/actions";
import { DocumentIllustration } from "@/features/knowledge/components/document-illustration";

// The file goes from the browser straight to Vercel Blob (our server only hands out an upload
// token), because a server action can't take a body over 4.5 MB. Then the details are saved.
export function UploadForm() {
  const form = useForm<DocumentDetailsInput>({
    resolver: zodResolver(DocumentDetailsSchema),
    defaultValues: { title: "", sourceUrl: null },
  });
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [pending, startTransition] = useTransition();
  const { errors } = form.formState;

  function checkFile(chosen: File | null) {
    if (!chosen) return "Choose a file";
    const extension = chosen.name.split(".").pop()?.toLowerCase() ?? "";
    if (!FILE_TYPES[extension]) return "Choose a PDF, .md or .txt file";
    if (chosen.size > MAX_FILE_MB * 1024 * 1024) return `Choose a file under ${MAX_FILE_MB} MB`;
    // The same limit as fileName in DocumentSchema, so a long name can't fail the save later.
    if (chosen.name.length > 255) return "Rename the file to under 255 characters";
    return null;
  }

  const onSubmit = form.handleSubmit((values) => {
    const error = checkFile(file);
    setFileError(error);
    if (error || !file) return;

    startTransition(async () => {
      const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
      let blobUrl;
      setProgress(0);
      try {
        const blob = await upload(`documents/${file.name}`, file, {
          access: "private",
          handleUploadUrl: "/api/documents/upload",
          contentType: FILE_TYPES[extension],
          onUploadProgress: ({ percentage }) => setProgress(Math.round(percentage)),
        });
        blobUrl = blob.url;
      } catch {
        setProgress(null);
        toast.error("The upload failed. Check the file and try again.");
        return;
      }
      // Caught here instead of going to error.tsx: the file is already uploaded and the fields
      // are filled in, so keeping them on screen lets the admin just press Upload again.
      try {
        await createDocumentAction({ ...values, fileName: file.name, blobUrl });
      } catch {
        setProgress(null);
        toast.error("The file uploaded, but the document didn't save. Try again.");
        return;
      }
      // The action redirects to the library, where the new document is the first row.
      toast.success("Document added");
    });
  });

  return (
    <FormPanel
      title="Knowledge base"
      description="Papers, government guides and provider docs that the assessments draw on."
      illustration={<DocumentIllustration />}
    >
      <form onSubmit={onSubmit} noValidate className="max-w-xl">
        <FieldGroup>
          {/* First, so the rule is read before a file is chosen */}
          <p className="flex gap-3 rounded-lg border border-neutral-300 bg-neutral-0 p-4 text-sm text-neutral-700">
            <ShieldCheck
              aria-hidden="true"
              className="size-5 shrink-0 text-neutral-900"
              strokeWidth={1.5}
            />
            <span>
              <strong className="font-semibold text-neutral-900">Published sources only.</strong>{" "}
              Never upload interview transcripts or participant data.
            </span>
          </p>

          <FileField
            id="file"
            label="File"
            hint={`PDF, .md or .txt, up to ${MAX_FILE_MB} MB`}
            accept=".pdf,.md,.txt"
            file={file}
            progress={progress}
            error={fileError ? { message: fileError } : undefined}
            onChange={(chosen) => {
              setFile(chosen);
              setFileError(chosen ? checkFile(chosen) : null);
              // Start the title from the file name; most files are already named after the source.
              if (chosen && !form.getValues("title")) {
                form.setValue("title", chosen.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "));
              }
            }}
          />

          <TextField id="title" label="Title" error={errors.title} {...form.register("title")} />

          <Controller
            control={form.control}
            name="module"
            render={({ field }) => (
              <ChoiceField
                name={field.name}
                label="Module"
                ids={DOCUMENT_MODULES}
                labels={DOCUMENT_MODULE_LABELS}
                value={field.value}
                onChange={field.onChange}
                error={errors.module}
              />
            )}
          />

          <Controller
            control={form.control}
            name="sourceType"
            render={({ field }) => (
              <ChoiceField
                name={field.name}
                label="Source type"
                ids={SOURCE_TYPES}
                labels={SOURCE_TYPE_LABELS}
                value={field.value}
                onChange={field.onChange}
                error={errors.sourceType}
              />
            )}
          />

          <TextField
            id="sourceUrl"
            label="Source link (optional)"
            type="url"
            placeholder="https://"
            error={errors.sourceUrl}
            {...form.register("sourceUrl", { setValueAs: (value) => value?.trim() || null })}
          />

          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            <AppButton variant="secondary" size="lg" asChild>
              <Link href="/admin/documents">Cancel</Link>
            </AppButton>
            <AppButton type="submit" size="lg" disabled={pending}>
              {pending ? "Uploading…" : "Upload document"}
            </AppButton>
          </div>
        </FieldGroup>
      </form>
    </FormPanel>
  );
}
