// Fake assistant + session data for the Investigation console.
// Everything here is derived from the case passed in (mockCase today), so
// when a real API replaces mockData the wording follows the real data.
// Swap buildCaseSummary / buildFakeReply for a real model call later.

import type { InvestigationCase } from "./types";

export const currentUser = {
  name: "Shivlok Sharma",
  firstName: "Shivlok",
  org: "Team Zortex",
  initials: "SS",
};

// Seed for the sidebar's "Recents" until the user has searched for things.
// Each of these resolves to the mock dossier.
export const defaultQueryHistory = [
  "shadowfox77",
  "greyfox",
  "0x9F3A21BC",
  "fox-market-mirror.onion",
  "sf77.contact@protonmail.com",
];

/* ---------------------------------------------------------------- */
/*  Helpers                                                          */
/* ---------------------------------------------------------------- */

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const bullets = (items: string[]) => items.map((i) => `• ${i}`).join("\n");

/** Lower-case the first letter for mid-sentence use, but leave acronyms (SSL, PGP) alone. */
const lowerFirst = (s: string) =>
  /^[A-Z][a-z]/.test(s) ? s[0].toLowerCase() + s.slice(1) : s;

const confidenceRank: Record<string, number> = {
  low: 0,
  medium: 1,
  high: 2,
  confirmed: 3,
};

const misconfigLabel: Record<string, string> = {
  exposed_server_status: "Exposed server-status page",
  ssl_certificate_reuse: "SSL certificate reuse",
  default_banner: "Default service banner",
  descriptor_inconsistency: "Descriptor inconsistency",
  shared_favicon_hash: "Shared favicon hash",
  leaked_header: "Leaked HTTP header",
};

const evidenceLabel: Record<string, string> = {
  stylometric: "Stylometric match",
  shared_pgp: "Shared PGP key",
  shared_wallet: "Shared wallet",
  temporal_correlation: "Temporal correlation",
  infrastructure_overlap: "Infrastructure overlap",
  manual_analyst: "Analyst assessment",
};

/** Average of the four attribution signals, rounded to a whole percent. */
export function overallScore(data: InvestigationCase): number {
  const s = data.attributionScore;
  const values = [
    s.pgpKeyMatch,
    s.walletReuse,
    s.stylometricSimilarity,
    s.temporalCorrelation,
  ];
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}

/* ---------------------------------------------------------------- */
/*  First message of a seeded chat                                   */
/* ---------------------------------------------------------------- */

export function buildCaseSummary(data: InvestigationCase): string {
  const { actor, sources, infrastructure, transactions } = data;

  const topFinding = [...infrastructure].sort(
    (a, b) => confidenceRank[b.confidence] - confidenceRank[a.confidence],
  )[0];
  const flagged = transactions.filter((t) => t.status === "flagged");

  const points = [
    `${actor.aliases.length} known aliases, linked through shared PGP key material and wallet reuse`,
  ];
  if (topFinding) {
    points.push(
      `${infrastructure.length} infrastructure findings — strongest is ${lowerFirst(misconfigLabel[topFinding.misconfigurationType])} (${topFinding.confidence})${
        topFinding.likelyOriginDomain
          ? `, pointing to ${topFinding.likelyOriginDomain}`
          : ""
      }`,
    );
  }
  points.push(
    flagged.length > 0
      ? `${flagged.length} flagged transaction${flagged.length > 1 ? "s" : ""} (${flagged
          .map((t) => t.amount)
          .join(", ")}) out of ${transactions.length} tracked`
      : `No flagged transactions across ${transactions.length} tracked`,
  );

  return [
    `**${actor.handle}** is a ${actor.category}-category actor with **${actor.attributionConfidence}** attribution confidence (**${overallScore(data)}%** composite score). First observed ${fmtDate(actor.firstSeen)}, last seen ${fmtDate(actor.lastSeen)} across ${sources.length} sources.`,
    "",
    bullets(points),
    "",
    "Ask me to dig into any of these.",
  ].join("\n");
}

export function buildNotFoundReply(query: string): string {
  return `No correlation record found for **${query}**. Zero threat indicators matched across the indexed sources. Verify the spelling, or try **shadowfox77**, the case loaded in this demo.`;
}

/* ---------------------------------------------------------------- */
/*  Follow-up replies                                                */
/* ---------------------------------------------------------------- */

export function suggestionsFor(found: boolean): string[] {
  return found
    ? [
        "Summarize this dossier",
        "Explain the attribution score",
        "Show flagged transactions",
      ]
    : ["What can I search for?"];
}

export function buildFakeReply(
  prompt: string,
  data: InvestigationCase,
  found: boolean,
): string {
  const p = prompt.toLowerCase();

  if (!found) {
    if (/search|find|what can|support|type|look/.test(p)) {
      return `You can search by:\n${bullets([
        "Actor handle or alias, e.g. **shadowfox77**",
        "PGP key ID, e.g. **0x9F3A21BC**",
        "Wallet address (BTC, ETH or XMR)",
        "Identifier such as an email, username or onion domain",
      ])}`;
    }
    return "There's no dossier loaded, so there's nothing to analyse yet. Search for a handle, alias, PGP key ID, wallet address or identifier, for example **shadowfox77**.";
  }

  const { actor, sources, infrastructure, evidence, timeline, transactions } =
    data;

  // Attribution score
  if (/score|attribution|confiden|how sure|certain/.test(p)) {
    const s = data.attributionScore;
    const signals = [
      { label: "PGP key match", value: s.pgpKeyMatch },
      { label: "Wallet reuse", value: s.walletReuse },
      { label: "Stylometric similarity", value: s.stylometricSimilarity },
      { label: "Temporal correlation", value: s.temporalCorrelation },
    ];
    const sorted = [...signals].sort((a, b) => b.value - a.value);
    const strongest = sorted[0];
    const weakest = sorted[sorted.length - 1];
    return `The composite attribution score is **${overallScore(data)}%**, the average of four signals:\n${bullets(
      signals.map((x) => `${x.label} — ${x.value}%`),
    )}\n\nStrongest signal is ${lowerFirst(strongest.label)}; weakest is ${lowerFirst(weakest.label)}, so I'd treat that one as supporting evidence rather than decisive.`;
  }

  // Infrastructure
  if (/infra|onion|origin|misconfig|\bssl\b|cert|server/.test(p)) {
    return `${infrastructure.length} infrastructure findings on the hidden service:\n${bullets(
      infrastructure.map(
        (f) =>
          `**${misconfigLabel[f.misconfigurationType]}** (${f.confidence})${
            f.likelyOriginDomain || f.likelyOriginIp
              ? ` — likely origin ${[f.likelyOriginDomain, f.likelyOriginIp]
                  .filter(Boolean)
                  .join(" / ")}`
              : ""
          }`,
      ),
    )}`;
  }

  // Wallets & transactions
  if (/wallet|transaction|\btx\b|btc|eth|xmr|ledger|flag|payout|money|fund/.test(p)) {
    const flagged = transactions.filter((t) => t.status === "flagged");
    const walletLine = actor.wallets
      .map((w) => `${w.currency}${w.label ? ` (${w.label.toLowerCase()})` : ""}`)
      .join(", ");
    const flaggedLine =
      flagged.length > 0
        ? `\n\nFlagged:\n${bullets(
            flagged.map(
              (t) => `${t.amount} from ${t.wallet} on ${fmtDate(t.date)}`,
            ),
          )}`
        : "\n\nNothing is flagged right now.";
    return `The actor controls ${actor.wallets.length} wallets: ${walletLine}. ${transactions.length} transactions are tracked, ${transactions.filter((t) => t.status === "confirmed").length} confirmed and ${transactions.filter((t) => t.status === "pending").length} pending.${flaggedLine}`;
  }

  // PGP keys
  if (/pgp|key|fingerprint/.test(p)) {
    const sharedKey = evidence.find((e) => e.evidenceType === "shared_pgp");
    return `${actor.pgpKeys.length} PGP keys are tied to this actor:\n${bullets(
      actor.pgpKeys.map(
        (k) =>
          `**${k.keyId}** — created ${fmtDate(k.createdAt)}, ${k.verified ? "verified" : "unverified"}`,
      ),
    )}${
      sharedKey
        ? `\n\nKey material links identities: ${sharedKey.relationshipLabel} (${sharedKey.confidence} confidence).`
        : ""
    }`;
  }

  // Aliases & connected entities
  if (/alias|identit|handle|linked|link|coldwave|entity|who/.test(p)) {
    const entities = data.relationships.nodes.filter((n) => n.type === "entity");
    return `${actor.handle} is known under ${actor.aliases.length} aliases:\n${bullets(
      actor.aliases.map((a) => `**${a.handle}** on ${a.platform}`),
    )}${
      entities.length > 0
        ? `\n\nConnected entity: **${entities.map((e) => e.label).join(", ")}**. See the Relationship Map tab for the links.`
        : ""
    }`;
  }

  // Timeline
  if (/timeline|when|first seen|history|chronolog/.test(p)) {
    const sorted = [...timeline].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
    return `${sorted.length} events on the timeline:\n${bullets(
      sorted.map((e) => `${fmtDate(e.date)} — ${e.title}`),
    )}`;
  }

  // Evidence
  if (/evidence|why|reason|proof|correlat/.test(p)) {
    return `${evidence.length} pieces of evidence support the links:\n${bullets(
      evidence.map(
        (e) =>
          `**${evidenceLabel[e.evidenceType]}** (${e.confidence}) — ${e.relationshipLabel}`,
      ),
    )}`;
  }

  // Sources
  if (/source|marketplace|forum|leak|telegram/.test(p)) {
    return `${sources.length} sources observed:\n${bullets(
      sources.map(
        (s) => `**${s.name}** — ${s.reliability} reliability, observed ${fmtDate(s.observedAt)}`,
      ),
    )}`;
  }

  // Summary / overview
  if (/summar|overview|dossier|page|tl;?dr|brief/.test(p)) {
    return buildCaseSummary(data);
  }

  if (/^(hi|hello|hey)\b/.test(p)) {
    return `Hi ${currentUser.firstName}. I'm looking at the **${actor.handle}** dossier. Ask about infrastructure, wallets, PGP keys, aliases, the timeline or the attribution score.`;
  }

  return `In this demo I can only answer from the **${actor.handle}** dossier. Try asking about infrastructure, wallets, PGP keys, aliases, evidence, the timeline or the attribution score.`;
}
