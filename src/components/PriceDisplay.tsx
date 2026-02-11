import type { ReactNode } from "react";
import { usePrice } from "../hooks/usePrice.ts";
import { formatPrice } from "../lib/utils.ts";

function Layout({
  children,
  connected,
}: {
  children: ReactNode;
  connected: boolean;
}) {
  return (
    <div className="space-y-2 text-center">
      <div className="font-mono text-[11px] tracking-[0.2em] text-zinc uppercase">
        BTC / USD
      </div>
      {children}
      <div className="inline-flex items-center gap-1.5 mt-1">
        <div
          className={`w-1.5 h-1.5 rounded-full ${connected ? "bg-bull" : "bg-gold-dim"} animate-glow-pulse`}
        />
        <span className="font-mono text-[10px] tracking-wider text-zinc">
          {connected ? "LIVE" : "CONNECTING"}
        </span>
      </div>
    </div>
  );
}

export function PriceDisplay() {
  const { data: price, isLoading, isError } = usePrice();

  if (isLoading) {
    return (
      <Layout connected={false}>
        <div className="h-10 w-52 mx-auto rounded bg-slate-mid animate-pulse" />
      </Layout>
    );
  }

  if (isError || price === undefined) {
    return (
      <Layout connected={false}>
        <div className="flex items-center justify-center h-10 font-mono text-bear text-sm">
          Price unavailable
        </div>
      </Layout>
    );
  }

  return (
    <Layout connected>
      <div className="font-mono text-4xl font-500 text-pearl tabular-nums tracking-tight">
        {formatPrice(price)}
      </div>
    </Layout>
  );
}
