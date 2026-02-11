import { describe, expect, it, vi, afterEach } from "vitest";
import { formatPrice, getTimeRemaining, formatCountdown } from "./utils";
import { GUESS_DURATION_MS } from "../../shared/constants.ts";

describe("formatPrice", () => {
  it("formats a round number as USD", () => {
    expect(formatPrice(65000)).toBe("$65,000.00");
  });

  it("formats a decimal price", () => {
    expect(formatPrice(100432.5)).toBe("$100,432.50");
  });

  it("formats zero", () => {
    expect(formatPrice(0)).toBe("$0.00");
  });
});

describe("getTimeRemaining", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns full duration when guess was just placed", () => {
    vi.spyOn(Date, "now").mockReturnValue(1000);
    expect(getTimeRemaining(1000)).toBe(GUESS_DURATION_MS);
  });

  it("returns partial remaining time", () => {
    vi.spyOn(Date, "now").mockReturnValue(31_000);
    expect(getTimeRemaining(1000)).toBe(GUESS_DURATION_MS - 30_000);
  });

  it("clamps to 0 when duration has passed", () => {
    vi.spyOn(Date, "now").mockReturnValue(100_000);
    expect(getTimeRemaining(0)).toBe(0);
  });
});

describe("formatCountdown", () => {
  it("formats full seconds", () => {
    expect(formatCountdown(5000)).toBe("5s");
  });

  it("rounds up partial seconds", () => {
    expect(formatCountdown(4100)).toBe("5s");
  });

  it("shows 1s for small remaining", () => {
    expect(formatCountdown(1)).toBe("1s");
  });
});
