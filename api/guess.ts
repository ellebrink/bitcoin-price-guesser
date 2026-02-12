import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { ConditionalCheckFailedException } from "@aws-sdk/client-dynamodb";
import { docClient, TABLE_NAME } from "../server/dynamo.js";
import { getBtcPrice } from "../shared/price.js";
import type { ActiveGuess, Player } from "../shared/types.js";

/**
 * POST /api/guess
 * Records an up/down guess with the current BTC price. Rejects if a guess is already active.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { playerId, direction } = req.body as {
    playerId?: string;
    direction?: string;
  };

  if (!playerId || typeof playerId !== "string") {
    return res.status(400).json({ error: "playerId required" });
  }
  if (direction !== "up" && direction !== "down") {
    return res.status(400).json({ error: 'direction must be "up" or "down"' });
  }

  const { Item } = await docClient.send(
    new GetCommand({ TableName: TABLE_NAME, Key: { playerId } }),
  );
  const player = Item as Player | undefined;
  if (!player) {
    return res.status(404).json({ error: "Player not found" });
  }

  const priceAtGuess = await getBtcPrice();
  const activeGuess: ActiveGuess = {
    direction,
    priceAtGuess,
    guessedAt: Date.now(),
  };

  // Only succeeds if no active guess exists
  try {
    await docClient.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { playerId },
        UpdateExpression: "SET activeGuess = :guess",
        ConditionExpression:
          "attribute_exists(playerId) AND (activeGuess = :null OR attribute_not_exists(activeGuess))",
        ExpressionAttributeValues: {
          ":guess": activeGuess,
          ":null": null,
        },
      }),
    );
  } catch (err) {
    if (err instanceof ConditionalCheckFailedException) {
      return res
        .status(409)
        .json({ error: "Active guess already exists. Resolve it first." });
    }
    throw err;
  }

  return res.json({ success: true, activeGuess });
}
