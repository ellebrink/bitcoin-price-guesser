const COINBASE_URL = "https://api.coinbase.com/v2/prices/BTC-USD/spot";

/**
 * Fetches the current BTC/USD spot price from the Coinbase public API.
 */
export async function getBtcPrice(): Promise<number> {
  const res = await fetch(COINBASE_URL);

  if (!res.ok) {
    throw new Error(`Coinbase API error: ${res.status}`);
  }

  const data = (await res.json()) as { data: { amount: string } };
  const price = parseFloat(data.data.amount);

  if (Number.isNaN(price)) {
    throw new Error("Coinbase API returned an invalid price");
  }

  return price;
}
