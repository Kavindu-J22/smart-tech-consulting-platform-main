import Link from "next/link";
import { CircleUserRound, Shield } from "lucide-react";
import { AppButton } from "@/components/shared/app-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogoutButton } from "@/features/auth/components/logout-button";

// The Admin link is only a shortcut. The admin pages check the role themselves.
// isCompact hides the name on phones so the admin header stays on one row.
type Props = { name: string; email: string; isAdmin: boolean; isCompact?: boolean };

export function UserMenu({ name, email, isAdmin, isCompact }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <AppButton variant="ghost" className="px-3" aria-label={`Account menu for ${name}`}>
          <CircleUserRound />
          <span className={isCompact ? "hidden md:inline" : undefined}>{name}</span>
        </AppButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="font-normal text-muted-foreground">{email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isAdmin && (
          <DropdownMenuItem asChild>
            <Link href="/admin/documents">
              <Shield />
              Admin
            </Link>
          </DropdownMenuItem>
        )}
        <LogoutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
