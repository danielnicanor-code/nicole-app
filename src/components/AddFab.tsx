"use client";

import Link from "next/link";
import { useState } from "react";

/**
 * The primary "+" action, shared between the mobile in-nav position and the
 * desktop bottom-right position. Tapping it opens a small choice between
 * Add Income / Add Expense rather than jumping straight into a form.
 */
export default function AddFab({ wrapperClassName }: { wrapperClassName: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close add menu"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 cursor-default"
        />
      )}

      <div className={wrapperClassName}>
        {open && (
          <>
            <Link
              href="/add?type=income"
              className="whitespace-nowrap rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-positive shadow-md transition active:scale-95"
            >
              Add Income
            </Link>
            <Link
              href="/add?type=expense"
              className="whitespace-nowrap rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-negative shadow-md transition active:scale-95"
            >
              Add Expense
            </Link>
          </>
        )}

        <button
          type="button"
          aria-label={open ? "Close add menu" : "Add transaction"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-pink-600 text-3xl font-light leading-none text-white shadow-lg transition active:scale-95"
        >
          {open ? "×" : "+"}
        </button>
      </div>
    </>
  );
}
