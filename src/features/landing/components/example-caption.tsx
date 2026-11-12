import { Badge } from "@/components/ui/badge";

// The words under the big mark, which is hidden from screen readers.
export function ExampleCaption({ count }: { count: number }) {
  return (
    <p className="flex items-center gap-2 text-sm text-neutral-600">
      <Badge variant="secondary">Example</Badge>
      <span>
        <span className="font-mono tabular-nums">{count}</span> of 4 modules scored
      </span>
    </p>
  );
}
