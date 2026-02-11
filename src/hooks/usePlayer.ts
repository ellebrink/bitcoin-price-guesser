import { useQuery } from "@tanstack/react-query";
import { fetchPlayer } from "../lib/api.ts";

const STORAGE_KEY = "btc-guesser-playerId";

/**
 * Returns the existing playerId from localStorage, or creates and persists a new UUID.
 */
function getOrCreatePlayerId(): string {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (existing) return existing;
  const id = crypto.randomUUID();
  localStorage.setItem(STORAGE_KEY, id);
  return id;
}

export const playerId = getOrCreatePlayerId();

/**
 * Fetches the player record from the backend via GET /api/player.
 */
export function usePlayer() {
  return useQuery({
    queryKey: ["player", playerId],
    queryFn: () => fetchPlayer(playerId),
  });
}
