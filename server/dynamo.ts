import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env;
if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
  throw new Error(
    "Missing required env vars: AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY",
  );
}

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

export const docClient = DynamoDBDocumentClient.from(client);
export const TABLE_NAME = "bitcoin-guesser-players";
