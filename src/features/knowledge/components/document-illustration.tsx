// A stack of source documents feeding the four module squares, drawn in the same line style as
// the company form's illustration. Decorative, so it's hidden from screen readers.
export function DocumentIllustration() {
  return (
    <svg
      viewBox="0 0 160 160"
      aria-hidden="true"
      className="size-full overflow-visible text-neutral-900"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* the back sheet, then the front sheet with its folded corner and lines of text */}
      <path d="M 52 18 L 104 12 L 112 82 L 60 88 Z" className="fill-neutral-100" />
      <path d="M 40 22 L 88 22 L 102 36 L 102 94 L 40 94 Z" className="fill-background" />
      <path d="M 88 22 L 88 36 L 102 36" />
      <path d="M 52 46 L 90 46 M 52 58 L 90 58 M 52 70 L 78 70" />
      <path d="M 52 82 L 66 82" strokeWidth="3.5" />

      {/* the drop into the modules */}
      <path d="M 71 104 L 71 116 M 65 110 L 71 116 L 77 110" />

      <rect x="47" y="124" width="22" height="16" rx="4" className="fill-blue-100" />
      <rect x="73" y="124" width="22" height="16" rx="4" className="fill-yellow-100" />
      <rect x="47" y="144" width="22" height="16" rx="4" className="fill-lilac-100" />
      <rect x="73" y="144" width="22" height="16" rx="4" className="fill-lime-100" />
    </svg>
  );
}
