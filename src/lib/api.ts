import type { Player, ActiveGuess } from "../../shared/types.ts";

/**
 * Response from POST /api/guess on success.
 */
export interface GuessResponse {
  success: boolean;
  activeGuess: ActiveGuess;
}

/**
 * Response from POST /api/resolve — either not yet resolved or a final result.
 */
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

/**
 * Narrowed type for a successfully resolved guess.
 */
export type ResolvedResult = Extract<ResolveResponse, { resolved: true }>;

/**
 * GET /api/player
 * Fetches or creates a player record.
 */
export async function fetchPlayer(playerId: string): Promise<Player> {
  const res = await fetch(
    `/api/player?playerId=${encodeURIComponent(playerId)}`,
  );
  if (!res.ok) throw new Error(`Failed to fetch player: ${res.status}`);
  return res.json() as Promise<Player>;
}

/**
 * POST /api/guess
 * Submits an up/down guess with the current BTC price.
 */
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

/**
 * POST /api/resolve
 * Resolves the active guess and returns the outcome.
 */
export async function resolveGuess(playerId: string): Promise<ResolveResponse> {
  const res = await fetch("/api/resolve", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ playerId }),
  });
  if (!res.ok) throw new Error(`Failed to resolve guess: ${res.status}`);
  return res.json() as Promise<ResolveResponse>;
}
