import { useQuery } from "@tanstack/react-query";
import { getBtcPrice } from "../../shared/binance.ts";

export function usePrice() {
  return useQuery({
    queryKey: ["btcPrice"],
    queryFn: getBtcPrice,
    refetchInterval: 3000,
  });
}
