import { useMutation, useQueryClient } from "@tanstack/react-query";
import { resolveGuess } from "../lib/api.ts";
import { playerId } from "./usePlayer.ts";

/**
 * Triggers guess resolution via POST /api/resolve and invalidates the player cache on success.
 */
export function useResolve() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => resolveGuess(playerId),
    onSuccess: (data) => {
      if (data.resolved) {
        queryClient.invalidateQueries({ queryKey: ["player", playerId] });
      }
    },
  });
}
