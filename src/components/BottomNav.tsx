"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "./nav-items";

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-stone-200 bg-white/95 backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-md items-stretch justify-around pb-[env(safe-area-inset-bottom)]">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 items-center justify-center py-3.5 text-sm font-semibold ${
                active ? "text-rose-500" : "text-stone-400"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
