import { useEffect, useMemo } from "react";
import { GUESS_DURATION_MS } from "../../../shared/constants.ts";
import type { ActiveGuess } from "../../../shared/types.ts";
import type { ResolvedResult } from "../../lib/api.ts";
import { useCountdown } from "../../hooks/useCountdown.ts";
import { useResolve } from "../../hooks/useResolve.ts";
import { formatPrice } from "../../lib/utils.ts";

const RING_CIRCUMFERENCE = 280;
const POLL_INTERVAL_MS = 5000;

export function GuessWaiting({
  activeGuess,
  onResolved,
}: {
  activeGuess: ActiveGuess;
  onResolved: (result: ResolvedResult) => void;
}) {
  const { remainingMs, isExpired, countdown } = useCountdown(
    activeGuess.guessedAt,
  );
  const resolve = useResolve();

  // Poll resolve endpoint once the countdown expires
  useEffect(() => {
    if (!isExpired) return;

    const poll = () => {
      resolve.mutate(undefined, {
        onSuccess: (data) => {
          if (data.resolved) onResolved(data);
        },
      });
    };

    poll();
    const interval = setInterval(poll, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [isExpired, onResolved]); // eslint-disable-line react-hooks/exhaustive-deps

  const ringOffset = useMemo(() => {
    if (remainingMs <= 0) return RING_CIRCUMFERENCE;
    const progress = remainingMs / GUESS_DURATION_MS;
    return RING_CIRCUMFERENCE * (1 - progress);
  }, [remainingMs]);

  const isBull = activeGuess.direction === "up";
  const accentColor = isBull ? "text-bull" : "text-bear";
  const strokeColor = isBull ? "#22c55e" : "#ef4444";
  const glowColor = isBull ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)";

  return (
    <div className="flex flex-col items-center gap-5 animate-fade-in">
      <div className="font-mono text-[11px] tracking-[0.2em] text-zinc uppercase">
        Your prediction
      </div>

      {/* Countdown ring */}
      <div className="relative w-28 h-28">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            className="text-slate-mid"
            strokeWidth="2"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={strokeColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={RING_CIRCUMFERENCE}
            strokeDashoffset={ringOffset}
            style={{
              transition: "stroke-dashoffset 1s linear",
              filter: `drop-shadow(0 0 6px ${glowColor})`,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-2xl font-500 text-pearl tabular-nums">
            {countdown}
          </span>
        </div>
      </div>

      <div className="text-center space-y-1">
        <div className={`font-display text-xl font-600 ${accentColor}`}>
          {isBull ? "↑ Up" : "↓ Down"}
        </div>
        <div className="font-mono text-xs text-zinc">
          at {formatPrice(activeGuess.priceAtGuess)}
        </div>
      </div>
    </div>
  );
}
