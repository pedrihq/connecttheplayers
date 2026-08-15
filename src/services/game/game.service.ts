import { apiClient } from "../api/client";
import { Club, GameSession, Player, SubmitGuessResponse } from "./game.types";

export const gameService = {
  startGame: () => apiClient.post<GameSession>("/start"),
  submitGuess: (sessionId: string, input: string) =>
    apiClient.post<SubmitGuessResponse>(
      `/sessionID/${sessionId}/?input=${input}`,
    ),
  searchPlayer: (input: string) =>
    apiClient.get<Array<Player>>(`/player/search?name=${input}`),
  searchClub: (input: string) =>
    apiClient.get<Array<Club>>(`/club/search?name=${input}`),
};
