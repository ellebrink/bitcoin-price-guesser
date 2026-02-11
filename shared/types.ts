/**
 * A pending guess: the direction, the BTC price at time of guess, and when it was placed.
 */
export interface ActiveGuess {
  direction: "up" | "down";
  priceAtGuess: number;
  guessedAt: number;
}

/**
 * A player record stored in DynamoDB.
 */
export interface Player {
  playerId: string;
  score: number;
  activeGuess: ActiveGuess | null;
}
