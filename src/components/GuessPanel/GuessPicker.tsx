import { useGuess } from "../../hooks/useGuess.ts";

export function GuessPicker() {
  const guess = useGuess();

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="font-mono text-[11px] tracking-[0.2em] text-zinc uppercase text-center">
        Will Bitcoin go...
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => guess.mutate("up")}
          disabled={guess.isPending}
          className="group relative overflow-hidden rounded-xl border border-bull/20 bg-bull/6 px-6 py-4 transition-all duration-300 hover:border-bull/40 hover:bg-bull/12 hover:shadow-[0_0_30px_-5px_rgba(34,197,94,0.2)] disabled:opacity-40 disabled:pointer-events-none"
        >
          <div className="relative z-10 flex flex-col items-center gap-1">
            <span className="text-bull text-2xl leading-none">↑</span>
            <span className="font-display font-600 text-bull text-sm tracking-wide uppercase">
              Up
            </span>
          </div>
        </button>
        <button
          onClick={() => guess.mutate("down")}
          disabled={guess.isPending}
          className="group relative overflow-hidden rounded-xl border border-bear/20 bg-bear/6 px-6 py-4 transition-all duration-300 hover:border-bear/40 hover:bg-bear/12 hover:shadow-[0_0_30px_-5px_rgba(239,68,68,0.2)] disabled:opacity-40 disabled:pointer-events-none"
        >
          <div className="relative z-10 flex flex-col items-center gap-1">
            <span className="text-bear text-2xl leading-none">↓</span>
            <span className="font-display font-600 text-bear text-sm tracking-wide uppercase">
              Down
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}
