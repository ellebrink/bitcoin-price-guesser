import { GUESS_DURATION_MS } from "../../shared/constants.ts";

export function formatPrice(price: number): string {
  return price.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function getTimeRemaining(guessedAt: number): number {
  const remaining = GUESS_DURATION_MS - (Date.now() - guessedAt);
  return Math.max(0, remaining);
}

export function formatCountdown(remainingMs: number): string {
  return `${Math.ceil(remainingMs / 1000)}s`;
}
