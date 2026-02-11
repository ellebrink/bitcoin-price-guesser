import { useState, useEffect } from "react";
import type { Player } from "../../../shared/types.ts";
import type { ResolvedResult } from "../../lib/api.ts";
import { GuessPicker } from "./GuessPicker.tsx";
import { GuessWaiting } from "./GuessWaiting.tsx";
import { GuessResult } from "./GuessResult.tsx";

const RESULT_DISPLAY_MS = 5000;

export function GuessPanel({ player }: { player: Player }) {
  const [result, setResult] = useState<ResolvedResult | null>(null);

  // Clear result after displaying briefly
  useEffect(() => {
    if (!result) return;
    const timer = setTimeout(() => setResult(null), RESULT_DISPLAY_MS);
    return () => clearTimeout(timer);
  }, [result]);

  if (result) return <GuessResult result={result} />;

  if (player.activeGuess)
    return (
      <GuessWaiting activeGuess={player.activeGuess} onResolved={setResult} />
    );

  return <GuessPicker />;
}
