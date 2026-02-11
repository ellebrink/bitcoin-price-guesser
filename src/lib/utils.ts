import { GUESS_DURATION_MS } from "../../shared/constants.ts";

/**
 * Formats a number as a USD currency string (e.g., "$65,432.10").
 */
export function formatPrice(price: number): string {
  return price.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Returns milliseconds remaining in the GUESS_DURATION_MS guess window, clamped to 0.
 */
export function getTimeRemaining(guessedAt: number): number {
  const remaining = GUESS_DURATION_MS - (Date.now() - guessedAt);
  return Math.max(0, remaining);
}

/**
 * Converts remaining ms to a display string in seconds (e.g., "42s").
 */
export function formatCountdown(remainingMs: number): string {
  return `${Math.ceil(remainingMs / 1000)}s`;
}
