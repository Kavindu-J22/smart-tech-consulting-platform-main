"use client";
import { useRef, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppButton } from "@/components/shared/app-button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { deleteDocumentAction } from "@/features/knowledge/actions";

type Props = { documentId: string; title: string };

export function DeleteDocumentButton({ documentId, title }: Props) {
  const [pending, startTransition] = useTransition();
  const isDeleted = useRef(false);

  function onConfirm() {
    startTransition(async () => {
      await deleteDocumentAction(documentId);
      isDeleted.current = true;
      toast.success(`Deleted ${title}`);
    });
  }

  // After a delete the row and this button are gone, so send focus to the list's heading
  // instead of letting it fall to <body>. After Cancel, the dialog's default (back to the
  // button) is right.
  function onCloseAutoFocus(event: Event) {
    if (!isDeleted.current) return;
    event.preventDefault();
    document.getElementById("documents-heading")?.focus();
  }

  return (
    <ConfirmDialog
      title={`Delete ${title}?`}
      description="This removes the document and its file. It can't be undone."
      confirmLabel="Delete document"
      pendingLabel="Deleting…"
      isPending={pending}
      onConfirm={onConfirm}
      onCloseAutoFocus={onCloseAutoFocus}
    >
      <AppButton
        variant="ghost"
        className="size-11 shrink-0 px-0 text-neutral-600 hover:text-destructive"
        aria-label={`Delete ${title}`}
      >
        <Trash2 aria-hidden="true" className="size-5" strokeWidth={1.5} />
      </AppButton>
    </ConfirmDialog>
  );
}
