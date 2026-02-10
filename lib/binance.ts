export async function getBtcPrice(): Promise<number> {
  const res = await fetch(
    "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT",
  );

  if (!res.ok) {
    throw new Error(`Binance API error: ${res.status}`);
  }

  const data = (await res.json()) as { price: string };
  return parseFloat(data.price);
}
