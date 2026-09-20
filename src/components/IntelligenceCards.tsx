// USE: 4-card grid summarizing an actor's key intelligence —
// PGP keys, wallets, identifiers, and sources. Shown right below ActorHeader.
// Pass the relevant arrays via props; no data fetching happens here.

import type { PGPKey, Wallet, Identifier, Source } from "../data/types";

interface IntelligenceCardsProps {
  pgpKeys: PGPKey[];
  wallets: Wallet[];
  identifiers: Identifier[];
  sources: Source[];
}

function Card({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-line bg-card p-4 sm:p-5 shadow-surface transition-colors duration-200 hover:border-line-strong">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-fg">{title}</h3>
        <span className="rounded-full bg-card-raised px-2 py-0.5 font-mono text-xs text-fg-muted">
          {count}
        </span>
      </div>
      <div className="mt-3 space-y-2">{children}</div>
    </div>
  );
}

export default function IntelligenceCards({
  pgpKeys,
  wallets,
  identifiers,
  sources,
}: IntelligenceCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Card title="PGP keys" count={pgpKeys.length}>
        {pgpKeys.map((key) => (
          <div
            key={key.keyId}
            className="flex items-center justify-between gap-2"
          >
            <span className="truncate font-mono text-xs text-fg-muted">
              {key.keyId}
            </span>
            <span
              className={`shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-medium ${
                key.verified
                  ? "bg-ok/10 text-ok"
                  : "bg-fg/[0.06] text-fg-subtle"
              }`}
            >
              {key.verified ? "verified" : "unverified"}
            </span>
          </div>
        ))}
      </Card>

      <Card title="Wallets" count={wallets.length}>
        {wallets.map((wallet) => (
          <div
            key={wallet.address}
            className="flex items-center justify-between gap-2"
          >
            <span
              className="truncate font-mono text-xs text-fg-muted"
              title={wallet.address}
            >
              {wallet.address.slice(0, 10)}...{wallet.address.slice(-4)}
            </span>
            <span className="shrink-0 rounded-md bg-accent/10 px-1.5 py-0.5 text-[10px] font-medium text-accent">
              {wallet.currency}
            </span>
          </div>
        ))}
      </Card>

      <Card title="Identifiers" count={identifiers.length}>
        {identifiers.map((id) => (
          <div
            key={id.value}
            className="flex items-center justify-between gap-2"
          >
            <span className="truncate font-mono text-xs text-fg-muted">
              {id.value}
            </span>
            <span className="shrink-0 text-[10px] uppercase tracking-wide text-fg-subtle">
              {id.type}
            </span>
          </div>
        ))}
      </Card>

      <Card title="Sources" count={sources.length}>
        {sources.map((source) => (
          <div
            key={source.id}
            className="flex items-center justify-between gap-2"
          >
            <span className="truncate text-xs text-fg-muted">
              {source.name}
            </span>
            <span className="shrink-0 text-[10px] uppercase tracking-wide text-fg-subtle">
              {source.type.replace("_", " ")}
            </span>
          </div>
        ))}
      </Card>
    </div>
  );
}