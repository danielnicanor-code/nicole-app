"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE, createSessionCookieValue } from "@/lib/session";
import { isLockedOut, recordFailedAttempt, clearAttempts } from "@/lib/loginThrottle";

export async function loginAction(
  _prevState: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  const pin = String(formData.get("pin") ?? "");
  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for") ?? "local";

  if (isLockedOut(ip)) {
    return { error: "Too many attempts. Please wait a minute and try again." };
  }

  const expectedPin = process.env.APP_PIN;
  if (!expectedPin) {
    return { error: "Server is not configured. Set APP_PIN." };
  }

  if (pin.length !== 6 || pin !== expectedPin) {
    recordFailedAttempt(ip);
    return { error: "Incorrect PIN. Try again." };
  }

  clearAttempts(ip);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, await createSessionCookieValue(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  const next = String(formData.get("next") ?? "");
  // Only follow same-site relative paths, to avoid an open redirect.
  const destination = next.startsWith("/") && !next.startsWith("//") ? next : "/";
  redirect(destination);
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  redirect("/login");
}
