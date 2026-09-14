const currencyFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatCurrency(amount: number | string): string {
  const value = typeof amount === "string" ? Number(amount) : amount;
  return currencyFormatter.format(value);
}

export function formatSignedCurrency(amount: number | string, type: "expense" | "income"): string {
  const formatted = formatCurrency(amount);
  return type === "expense" ? `−${formatted}` : `+${formatted}`;
}

// These formatters always receive Date.UTC(...)-constructed dates representing a
// stored calendar date (not a real instant), so they're pinned to UTC to avoid
// shifting to the previous/next day based on the server's local timezone.
const monthFormatter = new Intl.DateTimeFormat("en-PH", { month: "long", year: "numeric", timeZone: "UTC" });
const dayFormatter = new Intl.DateTimeFormat("en-PH", {
  weekday: "short",
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

export function formatMonthLabel(date: Date): string {
  return monthFormatter.format(date);
}

const monthShortFormatter = new Intl.DateTimeFormat("en-PH", { month: "short", year: "2-digit", timeZone: "UTC" });

export function formatMonthShort(date: Date): string {
  return monthShortFormatter.format(date);
}

export function formatDayLabel(date: Date): string {
  return dayFormatter.format(date);
}

export function monthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

/**
 * Nicole's data is all in Philippine time. Deriving "today"/"this month" from a
 * server-side `new Date()` would use whatever timezone the server happens to run
 * in (UTC on Vercel), which can be hours off from Manila near day/month
 * boundaries. This reads the current date directly in Asia/Manila instead.
 */
export function getCurrentManilaDateParts(): { year: number; month: number; day: number } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const get = (type: string) => Number(parts.find((p) => p.type === type)!.value);
  return { year: get("year"), month: get("month"), day: get("day") };
}

/** Good morning/afternoon/evening, based on the current hour in Asia/Manila (UTC+8). */
export function getManilaGreeting(): string {
  const hourStr = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Manila",
    hour: "2-digit",
    hour12: false,
  }).format(new Date());
  const hour = Number(hourStr) % 24; // some environments format midnight as "24"
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function todayISODate(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 10);
}
