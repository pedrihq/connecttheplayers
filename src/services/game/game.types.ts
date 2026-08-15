export type GameStep = "CLUB" | "PLAYER" | "WIN";

export type Club = {
  id: number;
  shortName: string;
  fullName: string;
  country: string;
  image: string;
};

export type Player = {
  id: number;
  fullName: string;
  shortName: string;
  country: string;
  position: string;
  dateOfBirth: string;
  age: number;
  image: string;
};

export type GameSession = {
  id: string;
  lastAccess: string;
  playerTo: Player;
  playerFrom: Player;
  gameStep: GameStep;
  gameList: Array<Player | Club>;
  playersTempo: Array<Player>;
  clubTempo: Array<Club>;
};

export type SubmitGuessResponse = {
  GameStep: GameStep;
  message: string;
  gameList: GameSession["gameList"];
  type: "error" | "success" | "warning" | 'info';
};
