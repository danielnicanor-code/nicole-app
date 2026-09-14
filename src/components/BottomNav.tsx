"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "./nav-items";

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-stone-200 bg-white/95 backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-md items-center justify-around px-2 py-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom))]">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-2xl px-4 py-3 text-sm font-medium transition ${
                active ? "bg-rose-100 text-accent" : "text-stone-500"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
      <Link
        href="/add"
        aria-label="Add transaction"
        className="absolute -top-7 right-6 flex h-16 w-16 items-center justify-center rounded-full bg-pink-600 text-3xl font-light leading-none text-white shadow-lg shadow-pink-600/30 transition active:scale-95"
      >
        +
      </Link>
    </nav>
  );
}
