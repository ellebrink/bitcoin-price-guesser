import { useMutation, useQueryClient } from "@tanstack/react-query";
import { resolveGuess } from "../lib/api.ts";
import { playerId } from "./usePlayer.ts";

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
