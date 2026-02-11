import { useState, useEffect } from "react";
import { getTimeRemaining, formatCountdown } from "../lib/utils.ts";

export function useCountdown(guessedAt: number) {
  const [remainingMs, setRemainingMs] = useState(() =>
    getTimeRemaining(guessedAt),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingMs(getTimeRemaining(guessedAt));
    }, 1000);
    return () => clearInterval(interval);
  }, [guessedAt]);

  return {
    remainingMs,
    isExpired: remainingMs <= 0,
    countdown: remainingMs > 0 ? formatCountdown(remainingMs) : "",
  };
}
