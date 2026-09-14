"use client";

import { logoutAction } from "@/app/login/actions";

export default function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        title="Log out"
        className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm text-stone-500 transition hover:bg-stone-100 hover:text-stone-700"
      >
        <span aria-hidden>⚙️</span>
        <span className="hidden sm:inline">Log out</span>
      </button>
    </form>
  );
}
