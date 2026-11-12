"use client";
import { useState, useTransition } from "react";
import { Ellipsis, Trash2 } from "lucide-react";
import { AppButton } from "@/components/shared/app-button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteCompanyAction } from "@/features/company/actions";

// Rare actions for a company, kept out of the way behind a "⋯" button.
type Props = { companyId: string; companyName: string };

export function CompanyMenu({ companyId, companyName }: Props) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <>
      {/* modal={false}: a modal menu that opens a dialog can leave the page unclickable */}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <AppButton variant="secondary" className="w-11 px-0" aria-label="More actions">
            <Ellipsis className="size-5" />
          </AppButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-48">
          <DropdownMenuItem variant="destructive" onSelect={() => setIsConfirmOpen(true)}>
            <Trash2 />
            Delete company
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title={`Delete ${companyName}?`}
        description="This removes the company and everything saved for it. It can't be undone."
        confirmLabel="Delete company"
        pendingLabel="Deleting…"
        isPending={pending}
        onConfirm={() => startTransition(() => deleteCompanyAction(companyId))}
      />
    </>
  );
}
