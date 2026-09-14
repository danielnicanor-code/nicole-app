"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "./nav-items";
import LogoutButton from "./LogoutButton";

export default function TopNav() {
  const pathname = usePathname();

  return (
    <header className="hidden items-center justify-between border-b border-stone-200 bg-white px-8 py-4 md:flex">
      <div className="flex items-center gap-2 text-lg font-bold text-stone-800">
        <span aria-hidden>🐻</span> Nicole App
      </div>
      <nav className="flex items-center gap-1 rounded-full bg-stone-100 p-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                active ? "bg-white text-rose-500 shadow-sm" : "text-stone-500 hover:text-stone-700"
              }`}
            >
              <span aria-hidden>{item.icon}</span> {item.label}
            </Link>
          );
        })}
      </nav>
      <LogoutButton />
    </header>
  );
}
