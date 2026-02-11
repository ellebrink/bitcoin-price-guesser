import { describe, expect, it, vi, beforeEach } from "vitest";
import { GUESS_DURATION_MS } from "../shared/constants.ts";
import type { Player } from "../shared/types.ts";

/**
 * All docClient.send() calls in the handler are routed through this spy.
 */
const mockSend = vi.fn();

vi.mock("../server/dynamo", () => ({
  docClient: { send: (...args: unknown[]) => mockSend(...args) },
  TABLE_NAME: "test-table",
}));

vi.mock("../shared/binance", () => ({
  getBtcPrice: vi.fn(),
}));

import resolve from "../api/resolve.ts";
import { getBtcPrice } from "../shared/binance.ts";

/**
 * Mock Vercel response. Each method returns `res` to support chaining (e.g., `res.status(400).json(...)`).
 */
function makeRes() {
  const res: Record<string, unknown> = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res as {
    status: ReturnType<typeof vi.fn>;
    json: ReturnType<typeof vi.fn>;
  };
}

/** Mock Vercel request. */
function makeReq(body: unknown) {
  return { method: "POST", body } as Parameters<typeof resolve>[0];
}

describe("resolve handler", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns correct & score +1 when guessed up and price went up", async () => {
    const player: Player = {
      playerId: "p1",
      score: 5,
      activeGuess: {
        direction: "up",
        priceAtGuess: 60_000,
        guessedAt: Date.now() - GUESS_DURATION_MS - 1000, // 61s ago — past the waiting period
      },
    };

    // Program mocks in the order the resolve handler calls them:
    mockSend.mockResolvedValueOnce({ Item: player }); // 1st send(): DynamoDB GetCommand
    vi.mocked(getBtcPrice).mockResolvedValueOnce(61_000); // price went up
    mockSend.mockResolvedValueOnce({}); // 2nd send(): DynamoDB UpdateCommand

    const res = makeRes();
    await resolve(makeReq({ playerId: "p1" }), res as never);

    expect(res.json).toHaveBeenCalledWith({
      resolved: true,
      result: "correct",
      scoreDelta: 1,
      newScore: 6,
      currentPrice: 61_000,
      priceAtGuess: 60_000,
    });
  });

  it("returns incorrect & score -1 when guessed up and price went down", async () => {
    const player: Player = {
      playerId: "p1",
      score: 3,
      activeGuess: {
        direction: "up",
        priceAtGuess: 60_000,
        guessedAt: Date.now() - GUESS_DURATION_MS - 1000,
      },
    };

    mockSend.mockResolvedValueOnce({ Item: player });
    vi.mocked(getBtcPrice).mockResolvedValueOnce(59_000); // price went down
    mockSend.mockResolvedValueOnce({});

    const res = makeRes();
    await resolve(makeReq({ playerId: "p1" }), res as never);

    expect(res.json).toHaveBeenCalledWith({
      resolved: true,
      result: "incorrect",
      scoreDelta: -1,
      newScore: 2,
      currentPrice: 59_000,
      priceAtGuess: 60_000,
    });
  });

  it("returns too_early when guess duration has not elapsed", async () => {
    const player: Player = {
      playerId: "p1",
      score: 0,
      activeGuess: {
        direction: "down",
        priceAtGuess: 60_000,
        guessedAt: Date.now() - 10_000, // only 10s ago — too early
      },
    };

    // Only one send() needed — handler returns before calling getBtcPrice or UpdateCommand
    mockSend.mockResolvedValueOnce({ Item: player });

    const res = makeRes();
    await resolve(makeReq({ playerId: "p1" }), res as never);

    // objectContaining: ignore the exact remainingMs value
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        resolved: false,
        reason: "too_early",
      }),
    );
  });
});
