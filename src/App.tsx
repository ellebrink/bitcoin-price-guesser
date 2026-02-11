import { usePlayer } from "./hooks/usePlayer.ts";
import { PriceDisplay } from "./components/PriceDisplay.tsx";
import { ScoreDisplay } from "./components/ScoreDisplay.tsx";
import { GuessPanel } from "./components/GuessPanel";

function App() {
  const { data: player, isLoading, isError } = usePlayer();

  if (isLoading) {
    return (
      <div className="noise-bg min-h-screen bg-void flex items-center justify-center">
        <div className="animate-pulse-soft font-mono text-zinc tracking-widest text-sm uppercase">
          Connecting...
        </div>
      </div>
    );
  }

  if (isError || !player) {
    return (
      <div className="noise-bg min-h-screen bg-void flex items-center justify-center">
        <div className="text-bear font-mono text-sm tracking-wide">
          Connection failed
        </div>
      </div>
    );
  }

  return (
    <div className="noise-bg min-h-screen bg-void flex items-center justify-center p-6 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gold/3 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gold/2 blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in">
          <img src="/favicon.svg" alt="" className="w-10 h-10 mx-auto mb-3" />
          <h1 className="font-display text-3xl font-600 text-pearl tracking-tight">
            Bitcoin Price Guesser
          </h1>
        </div>

        {/* Main card */}
        <div className="bg-obsidian/80 backdrop-blur-xl border border-slate-light/50 rounded-2xl p-8 space-y-8 shadow-[0_0_80px_-20px_rgba(212,168,67,0.08)] animate-fade-in-up relative overflow-hidden">
          <PriceDisplay />

          <div className="h-px bg-linear-to-r from-transparent via-slate-light to-transparent" />

          <ScoreDisplay player={player} />

          <div className="h-px bg-linear-to-r from-transparent via-slate-light to-transparent" />

          <GuessPanel player={player} />
        </div>

        {/* Footer accent */}
        <div
          className="mt-6 text-center animate-fade-in"
          style={{ animationDelay: "0.3s" }}
        >
          <span className="font-mono text-[10px] tracking-[0.3em] text-zinc/40 uppercase">
            60s prediction window
          </span>
        </div>
      </div>
    </div>
  );
}

export default App;
