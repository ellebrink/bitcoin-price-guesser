import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { docClient, TABLE_NAME } from "../lib/dynamo";
import type { Player } from "../lib/types";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const playerId = req.query.playerId;
  if (typeof playerId !== "string" || !playerId) {
    return res.status(400).json({ error: "playerId query param required" });
  }

  const { Item } = await docClient.send(
    new GetCommand({ TableName: TABLE_NAME, Key: { playerId } }),
  );
  const player = Item as Player | undefined;
  if (player) {
    return res.json(player);
  }
  const newPlayer: Player = { playerId, score: 0, activeGuess: null };
  await docClient.send(
    new PutCommand({ TableName: TABLE_NAME, Item: newPlayer }),
  );
  return res.json(newPlayer);
}
