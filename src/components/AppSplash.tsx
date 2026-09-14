"use client";

import { useEffect, useState } from "react";

/** Shows the app icon full-screen for a moment on launch, then fades out. */
export default function AppSplash() {
  const [phase, setPhase] = useState<"visible" | "fading" | "hidden">("visible");

  useEffect(() => {
    const lingerTimer = setTimeout(() => setPhase("fading"), 1000);
    const removeTimer = setTimeout(() => setPhase("hidden"), 1300);
    return () => {
      clearTimeout(lingerTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (phase === "hidden") return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#bf648f] transition-opacity duration-300 ${
        phase === "fading" ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/icon.png" alt="Nicole App" className="h-28 w-28 rounded-[28px] shadow-xl" />
    </div>
  );
}
