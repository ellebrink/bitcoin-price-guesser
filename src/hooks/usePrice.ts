import { useQuery } from "@tanstack/react-query";
import { getBtcPrice } from "../../shared/price.ts";

const POLL_INTERVAL_MS = 3000;

/**
 * Polls price query every POLL_INTERVAL_MS for the live BTC/USD price.
 */
export function usePrice() {
  return useQuery({
    queryKey: ["btcPrice"],
    queryFn: getBtcPrice,
    refetchInterval: POLL_INTERVAL_MS,
  });
}
