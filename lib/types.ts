export interface ActiveGuess {
  direction: "up" | "down";
  priceAtGuess: number;
  guessedAt: number;
}

export interface Player {
  playerId: string;
  score: number;
  activeGuess: ActiveGuess | null;
}
