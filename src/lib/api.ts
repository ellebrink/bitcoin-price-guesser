import type { Player, ActiveGuess } from "../../shared/types.ts";

export interface GuessResponse {
  success: boolean;
  activeGuess: ActiveGuess;
}

export type ResolveResponse =
  | { resolved: false; reason: string; remainingMs?: number }
  | {
      resolved: true;
      result: "correct" | "incorrect";
      scoreDelta: number;
      newScore: number;
      currentPrice: number;
      priceAtGuess: number;
    };

export type ResolvedResult = Extract<ResolveResponse, { resolved: true }>;

export async function fetchPlayer(playerId: string): Promise<Player> {
  const res = await fetch(
    `/api/player?playerId=${encodeURIComponent(playerId)}`,
  );
  if (!res.ok) throw new Error(`Failed to fetch player: ${res.status}`);
  return res.json() as Promise<Player>;
}

export async function submitGuess(
  playerId: string,
  direction: "up" | "down",
): Promise<GuessResponse> {
  const res = await fetch("/api/guess", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ playerId, direction }),
  });
  if (!res.ok) throw new Error(`Failed to submit guess: ${res.status}`);
  return res.json() as Promise<GuessResponse>;
}

export async function resolveGuess(playerId: string): Promise<ResolveResponse> {
  const res = await fetch("/api/resolve", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ playerId }),
  });
  if (!res.ok) throw new Error(`Failed to resolve guess: ${res.status}`);
  return res.json() as Promise<ResolveResponse>;
}
