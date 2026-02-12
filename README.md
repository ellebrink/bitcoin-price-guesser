# Bitcoin Price Guesser

A real-time Bitcoin price guessing game. Predict whether the price will go up or down, wait 60 seconds, and see if you were right.

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fellebrink%2Fbitcoin-price-guesser&env=AWS_ACCESS_KEY_ID,AWS_SECRET_ACCESS_KEY,AWS_REGION&envDefaults=%7B%22AWS_REGION%22%3A%22eu-north-1%22%7D&envDescription=AWS%20credentials%20for%20DynamoDB%20access.%20See%20the%20AWS%20Setup%20section%20in%20the%20README.)

## How It Works

1. A player is automatically created for you (persisted in your browser)
2. See the current Bitcoin price in real time via the Binance API
3. Guess **Up** or **Down**
4. Wait 60 seconds for the result
5. If the price moved in the direction you guessed, you score **+1**; otherwise **-1**

Your score persists across sessions.

## Tech Stack

- **Frontend** — React, Vite, Tailwind CSS, TanStack Query
- **Backend** — Vercel Serverless Functions (Node.js)
- **Database** — DynamoDB
- **Price Data** — Binance public API (`GET /api/v3/ticker/price`)

## Prerequisites

- An **AWS account** (free tier covers DynamoDB for this use case)
- A **Vercel account** (free hobby tier works)
- **Node.js** >= 18
- **pnpm** (`npm i -g pnpm`)

## AWS Setup

### 1. Create the DynamoDB table

```bash
aws dynamodb create-table \
  --table-name bitcoin-guesser-players \
  --attribute-definitions AttributeName=playerId,AttributeType=S \
  --key-schema AttributeName=playerId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region eu-north-1
```

### 2. Create an IAM user with minimal permissions

Create the user:

```bash
aws iam create-user --user-name bitcoin-guesser-deployer
```

Attach an inline policy scoped to the table:

```bash
aws iam put-user-policy \
  --user-name bitcoin-guesser-deployer \
  --policy-name BitcoinGuesserDynamoDB \
  --policy-document '{
    "Version": "2012-10-17",
    "Statement": [{
      "Effect": "Allow",
      "Action": ["dynamodb:GetItem", "dynamodb:PutItem", "dynamodb:UpdateItem"],
      "Resource": "arn:aws:dynamodb:*:*:table/bitcoin-guesser-players"
    }]
  }'
```

Generate access keys:

```bash
aws iam create-access-key --user-name bitcoin-guesser-deployer
```

Save the **Access Key ID** and **Secret Access Key** from the output — you'll need them in the next step.

## Deploy to Vercel

The fastest way is the **Deploy** button at the top of this README. It will:

1. Clone the repo into your GitHub account
2. Prompt you for the three required environment variables
3. Deploy automatically

Alternatively, deploy manually:

1. Import the repo in the [Vercel dashboard](https://vercel.com/new)
2. Add these environment variables in **Settings > Environment Variables**:

   | Variable                | Value                         |
   | ----------------------- | ----------------------------- |
   | `AWS_ACCESS_KEY_ID`     | Your IAM access key           |
   | `AWS_SECRET_ACCESS_KEY` | Your IAM secret key           |
   | `AWS_REGION`            | `eu-north-1` (or your region) |

3. Deploy

## Local Development

Install dependencies:

```bash
pnpm install
```

Install the Vercel CLI (if you don't have it):

```bash
npm i -g vercel
```

Link to your Vercel project and pull env vars:

```bash
vercel link
vercel env pull
```

Start the dev server (serves both frontend and API routes):

```bash
vercel dev
```

## Running Tests

```bash
pnpm test
```

## Project Structure

```
api/               Vercel serverless functions
  guess.ts           Submit an up/down guess
  player.ts          Get or create a player
  resolve.ts         Resolve a guess after 60s
server/            Backend-only utilities
  dynamo.ts          DynamoDB client
shared/            Code shared by frontend and backend
  binance.ts         Binance price fetcher
  constants.ts       Shared constants
  types.ts           TypeScript types
src/               React frontend
  components/        UI components
  hooks/             Custom React hooks
  lib/               API client and utilities
tests/             Unit tests
```
