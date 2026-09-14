import Link from "next/link";

export default function FloatingAddButton() {
  return (
    <Link
      href="/add"
      aria-label="Add transaction"
      className="fixed bottom-20 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-rose-500 text-3xl font-light leading-none text-white shadow-lg shadow-rose-500/30 transition active:scale-95 md:bottom-8 md:right-8"
    >
      +
    </Link>
  );
}
