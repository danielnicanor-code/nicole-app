import Link from "next/link";

export default function FloatingAddButton() {
  return (
    <Link
      href="/add"
      aria-label="Add transaction"
      className="fixed bottom-8 right-8 z-40 hidden h-14 w-14 items-center justify-center rounded-full bg-accent text-3xl font-light leading-none text-white shadow-lg shadow-rose-500/30 transition active:scale-95 md:flex"
    >
      +
    </Link>
  );
}
