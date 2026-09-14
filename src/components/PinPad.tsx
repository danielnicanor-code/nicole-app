"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { loginAction } from "@/app/login/actions";

const PIN_LENGTH = 6;
const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"];

export default function PinPad({ next }: { next?: string }) {
  const [state, formAction, isPending] = useActionState(loginAction, undefined);
  const [digits, setDigits] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const submittedRef = useRef(false);

  // Reset the pad when a new error comes back from the server action. Done
  // during render (comparing against the last-seen state) rather than in an
  // effect, to avoid an extra cascading render.
  const [prevState, setPrevState] = useState(state);
  if (state !== prevState) {
    setPrevState(state);
    if (state?.error) {
      setDigits("");
    }
  }

  useEffect(() => {
    if (digits.length === PIN_LENGTH) {
      if (!submittedRef.current) {
        submittedRef.current = true;
        formRef.current?.requestSubmit();
      }
    } else {
      submittedRef.current = false;
    }
  }, [digits]);

  function press(key: string) {
    if (isPending) return;
    if (key === "⌫") {
      setDigits((d) => d.slice(0, -1));
      return;
    }
    if (key === "") return;
    setDigits((d) => (d.length < PIN_LENGTH ? d + key : d));
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key >= "0" && e.key <= "9") press(e.key);
      if (e.key === "Backspace") press("⌫");
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPending]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col items-center gap-8">
      <input type="hidden" name="pin" value={digits} />
      <input type="hidden" name="next" value={next ?? ""} />

      <div className="flex gap-3">
        {Array.from({ length: PIN_LENGTH }).map((_, i) => (
          <div
            key={i}
            className={`h-4 w-4 rounded-full border-2 transition-colors ${
              i < digits.length ? "border-rose-400 bg-rose-400" : "border-rose-200 bg-transparent"
            }`}
          />
        ))}
      </div>

      {state?.error && <p className="text-sm font-medium text-negative">{state.error}</p>}

      <div className="grid grid-cols-3 gap-4">
        {KEYS.map((key, i) =>
          key === "" ? (
            <div key={i} />
          ) : (
            <button
              key={i}
              type="button"
              onClick={() => press(key)}
              disabled={isPending}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-2xl font-semibold text-stone-700 shadow-sm active:scale-95 active:bg-rose-50 transition disabled:opacity-50 sm:h-18 sm:w-18"
            >
              {key}
            </button>
          )
        )}
      </div>
    </form>
  );
}
