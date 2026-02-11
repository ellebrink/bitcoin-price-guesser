import type { Player } from "../../shared/types.ts";

export function ScoreDisplay({ player }: { player: Player }) {
  return (
    <div className="flex items-center justify-center gap-3">
      <div className="font-mono text-[11px] tracking-[0.2em] text-zinc uppercase">
        Score
      </div>
      <div className="font-mono text-2xl font-500 text-gold tabular-nums">
        {player.score}
      </div>
    </div>
  );
}
