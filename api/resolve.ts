import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { docClient, TABLE_NAME } from "../lib/dynamo";
import { getBtcPrice } from "../lib/binance";
import type { Player } from "../lib/types";

const GUESS_DURATION_MS = 60_000;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { playerId } = req.body as { playerId?: string };
  if (!playerId || typeof playerId !== "string") {
    return res.status(400).json({ error: "playerId required" });
  }

  const { Item } = await docClient.send(
    new GetCommand({ TableName: TABLE_NAME, Key: { playerId } }),
  );
  const player = Item as Player | undefined;
  if (!player) {
    return res.status(404).json({ error: "Player not found" });
  }

  const { activeGuess } = player;
  if (!activeGuess) {
    return res.json({ resolved: false, reason: "no_guess" });
  }

  const elapsed = Date.now() - activeGuess.guessedAt;

  if (elapsed < GUESS_DURATION_MS) {
    return res.json({
      resolved: false,
      reason: "too_early",
      remainingMs: GUESS_DURATION_MS - elapsed,
    });
  }

  const currentPrice = await getBtcPrice();

  if (currentPrice === activeGuess.priceAtGuess) {
    return res.json({ resolved: false, reason: "price_unchanged" });
  }

  const priceWentUp = currentPrice > activeGuess.priceAtGuess;
  const correct =
    (activeGuess.direction === "up" && priceWentUp) ||
    (activeGuess.direction === "down" && !priceWentUp);
  const scoreDelta = correct ? 1 : -1;

  await docClient.send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { playerId },
      UpdateExpression: "SET score = score + :delta, activeGuess = :null",
      ExpressionAttributeValues: {
        ":delta": scoreDelta,
        ":null": null,
      },
    }),
  );

  const newScore = player.score + scoreDelta;

  return res.json({
    resolved: true,
    result: correct ? "correct" : "incorrect",
    scoreDelta,
    newScore,
    currentPrice,
    priceAtGuess: activeGuess.priceAtGuess,
  });
}
