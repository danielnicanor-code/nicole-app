import Link from "next/link";

/** The primary "+" action, shared between the mobile in-nav position and the desktop bottom-right position. */
export default function AddFab({ className }: { className: string }) {
  return (
    <Link
      href="/add"
      aria-label="Add transaction"
      className={`${className} h-16 w-16 items-center justify-center rounded-full bg-pink-600 text-3xl font-light leading-none text-white shadow-lg transition active:scale-95`}
    >
      +
    </Link>
  );
}
