"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/** Briefly celebrates after a new transaction is added (redirect carries ?celebrate=1). */
export default function AddCelebrationToast() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const shouldCelebrate = searchParams.get("celebrate") === "1";
  const [visible, setVisible] = useState(shouldCelebrate);

  useEffect(() => {
    if (!shouldCelebrate) return;
    const hide = setTimeout(() => setVisible(false), 300);
    const cleanUrl = setTimeout(() => router.replace("/", { scroll: false }), 300);
    return () => {
      clearTimeout(hide);
      clearTimeout(cleanUrl);
    };
  }, [shouldCelebrate, router]);

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-6 z-50 flex justify-center px-4">
      <div className="rounded-full bg-stone-800 px-4 py-2 text-sm font-semibold text-white shadow-lg">
        Good job Doc! 😜
      </div>
    </div>
  );
}
