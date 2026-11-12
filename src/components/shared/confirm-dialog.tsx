"use client";
import { AlertDialog as AlertDialogPrimitive } from "radix-ui";
import { AppButton } from "@/components/shared/app-button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// The one confirm dialog for anything that can't be undone, such as a delete.
// The confirm button is a plain button, not a dialog "action", so the dialog stays open
// (showing pendingLabel) until the action redirects away.
// Pass children for a button that opens it, or open + onOpenChange to open it from
// somewhere else, such as a menu item.
// Pass onCloseAutoFocus when the opening button can disappear (a deleted row): call
// event.preventDefault() and focus something else, or focus falls to <body>.
type Props = {
  title: string;
  description: string;
  confirmLabel: string;
  pendingLabel: string;
  isPending: boolean;
  onConfirm: () => void;
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onCloseAutoFocus?: (event: Event) => void;
};

export function ConfirmDialog({
  title,
  description,
  confirmLabel,
  pendingLabel,
  isPending,
  onConfirm,
  children,
  open,
  onOpenChange,
  onCloseAutoFocus,
}: Props) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {children && <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>}
      <AlertDialogContent
        onCloseAutoFocus={onCloseAutoFocus}
        className="gap-6 p-6 data-[size=default]:max-w-[calc(100%-2rem)] sm:p-8 data-[size=default]:sm:max-w-md"
      >
        <div className="flex flex-col gap-2">
          <AlertDialogTitle className="text-xl font-bold text-neutral-900">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base text-neutral-600">
            {description}
          </AlertDialogDescription>
        </div>
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <AlertDialogPrimitive.Cancel asChild>
            <AppButton variant="secondary" disabled={isPending}>
              Cancel
            </AppButton>
          </AlertDialogPrimitive.Cancel>
          <AppButton variant="danger" disabled={isPending} onClick={onConfirm}>
            {isPending ? pendingLabel : confirmLabel}
          </AppButton>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
