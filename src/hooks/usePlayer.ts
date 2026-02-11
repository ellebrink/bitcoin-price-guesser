import { useQuery } from "@tanstack/react-query";
import { fetchPlayer } from "../lib/api.ts";

const STORAGE_KEY = "btc-guesser-playerId";

function getOrCreatePlayerId(): string {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (existing) return existing;
  const id = crypto.randomUUID();
  localStorage.setItem(STORAGE_KEY, id);
  return id;
}

export const playerId = getOrCreatePlayerId();

export function usePlayer() {
  return useQuery({
    queryKey: ["player", playerId],
    queryFn: () => fetchPlayer(playerId),
  });
}
