import Link from "next/link";

// The four squares are the four modules, in the same order and colours as the module cards:
// infrastructure, marketing, compliance, product. The name may change, so it's written only here
// and in the root layout's metadata.
// h-11 so the logo link is a full 44px tap target on phones.
// The landing page passes href="/" because logged-out visitors can't open /companies.
type Props = { href?: string };

export function AppLogo({ href = "/companies" }: Props) {
  return (
    <Link href={href} className="flex h-11 w-fit items-center gap-2">
      <span aria-hidden="true" className="grid grid-cols-2 gap-0.5">
        <span className="size-2.5 rounded-[3px] bg-blue-300" />
        <span className="size-2.5 rounded-[3px] bg-yellow-300" />
        <span className="size-2.5 rounded-[3px] bg-lilac-300" />
        <span className="size-2.5 rounded-[3px] bg-lime-300" />
      </span>
      <span className="text-xl font-bold tracking-tighter text-neutral-900">smart</span>
    </Link>
  );
}
