import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitGuess } from "../lib/api.ts";
import { playerId } from "./usePlayer.ts";

export function useGuess() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (direction: "up" | "down") => submitGuess(playerId, direction),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["player", playerId] });
    },
  });
}
