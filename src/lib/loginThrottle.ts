// Lightweight in-memory throttle for the PIN login form. Good enough to slow down
// casual brute-forcing on a single-instance personal app; resets on cold start.
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 60 * 1000;

const attempts = new Map<string, { count: number; lockedUntil: number }>();

export function isLockedOut(key: string): boolean {
  const entry = attempts.get(key);
  if (!entry) return false;
  if (entry.lockedUntil && entry.lockedUntil > Date.now()) return true;
  if (entry.lockedUntil && entry.lockedUntil <= Date.now()) {
    attempts.delete(key);
  }
  return false;
}

export function recordFailedAttempt(key: string): void {
  const entry = attempts.get(key) ?? { count: 0, lockedUntil: 0 };
  entry.count += 1;
  if (entry.count >= MAX_ATTEMPTS) {
    entry.lockedUntil = Date.now() + LOCKOUT_MS;
    entry.count = 0;
  }
  attempts.set(key, entry);
}

export function clearAttempts(key: string): void {
  attempts.delete(key);
}
