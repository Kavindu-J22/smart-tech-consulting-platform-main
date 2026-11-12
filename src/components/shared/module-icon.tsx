import { Megaphone, Package, Scale, Server, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Each module keeps one colour from the brand palette everywhere it appears.
const ICONS: Record<string, LucideIcon> = {
  infrastructure: Server,
  marketing: Megaphone,
  compliance: Scale,
  product: Package,
};

const COLOURS: Record<string, string> = {
  infrastructure: "bg-blue-100",
  marketing: "bg-yellow-100",
  compliance: "bg-lilac-100",
  product: "bg-lime-100",
};

type Props = { module: string };

export function ModuleIcon({ module }: Props) {
  const Icon = ICONS[module];
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex size-11 shrink-0 items-center justify-center rounded-lg text-neutral-900",
        COLOURS[module],
      )}
    >
      <Icon className="size-5" strokeWidth={1.5} />
    </span>
  );
}
