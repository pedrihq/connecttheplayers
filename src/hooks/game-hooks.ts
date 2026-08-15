import { gameService } from "@/services/game/game.service";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useStartGame() {
  return useMutation({
    mutationFn: gameService.startGame,
  });
}

export function useSubmitGuess() {
  return useMutation({
    mutationFn: ({ sessionId, input }: { sessionId: string; input: string }) =>
      gameService.submitGuess(sessionId, input),
  });
}

export function useSearchPlayer() {
  return useMutation({
    mutationFn: (input: string) => gameService.searchPlayer(input),
  });
}

export function useSearchClub() {
  return useMutation({
    mutationFn: (input: string) => gameService.searchClub(input),
  });
}
