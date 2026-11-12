// Copied from the prototype's EligibilityIllustration: a founder holding a checked-off document.
// Decorative, so it's hidden from screen readers.
export function CompanyIllustration() {
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
      <path
        d="M 30 160 C 30 120, 60 100, 80 100 C 100 100, 130 120, 130 160"
        className="fill-blue-50"
      />
      <circle cx="80" cy="65" r="24" className="fill-background" />
      <path d="M 70 60 Q 75 55 80 60 M 90 60 Q 95 55 100 60" />
      <path d="M 85 75 Q 90 77 95 72" />
      <path d="M 50 65 C 50 40, 110 35, 105 70" />
      <path d="M 105 70 C 110 60, 115 50, 100 45" />
      <path d="M 60 125 L 110 115 L 120 160 L 70 160 Z" className="fill-background" />
      <path d="M 75 135 L 105 130 M 80 145 L 100 140" />
      <path
        d="M 100 55 C 100 40, 115 30, 130 30 C 145 30, 160 40, 160 55 C 160 70, 145 80, 130 80 L 115 85 L 115 78 C 105 75, 100 65, 100 55 Z"
        className="fill-background"
      />
      <path d="M 120 55 L 128 65 L 140 45" strokeWidth="3" />
    </svg>
  );
}
