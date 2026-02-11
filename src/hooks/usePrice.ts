import { useQuery } from "@tanstack/react-query";
import { getBtcPrice } from "../../shared/binance.ts";

const POLL_INTERVAL_MS = 3000;

/**
 * Polls Binance every POLL_INTERVAL_MS for the live BTC/USDT price.
 */
export function usePrice() {
  return useQuery({
    queryKey: ["btcPrice"],
    queryFn: getBtcPrice,
    refetchInterval: POLL_INTERVAL_MS,
  });
}
