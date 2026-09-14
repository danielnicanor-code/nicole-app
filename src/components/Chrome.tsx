"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import TopNav from "./TopNav";
import BottomNav from "./BottomNav";
import FloatingAddButton from "./FloatingAddButton";

const TAB_PATHS = ["/", "/expenses", "/summary"];

export default function Chrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const showChrome = TAB_PATHS.includes(pathname);

  if (!showChrome) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-dvh flex-col bg-[#bf648f]">
      <TopNav />
      <main className="flex-1 pb-24 md:pb-10">{children}</main>
      <BottomNav />
      <FloatingAddButton />
    </div>
  );
}
