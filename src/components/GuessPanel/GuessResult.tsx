import type { ResolvedResult } from "../../lib/api.ts";
import { formatPrice } from "../../lib/utils.ts";

export function GuessResult({ result }: { result: ResolvedResult }) {
  const isCorrect = result.result === "correct";

  return (
    <div className="text-center animate-result-pop">
      <div
        className={`text-3xl font-display font-700 tracking-tight ${isCorrect ? "text-bull" : "text-bear"}`}
      >
        {isCorrect ? "Correct" : "Incorrect"}
      </div>
      <div className="font-mono text-sm text-zinc mt-3">
        {formatPrice(result.priceAtGuess)}
        <span className="mx-2 text-slate-light">→</span>
        {formatPrice(result.currentPrice)}
      </div>
      <div
        className={`font-mono text-lg font-500 mt-2 ${isCorrect ? "text-bull" : "text-bear"}`}
      >
        {result.scoreDelta > 0 ? "+1" : "−1"}
      </div>
    </div>
  );
}
