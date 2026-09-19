import type { InfrastructureFinding, InvestigationCase, Source } from "./types";

// Single mock case used to build out the Investigation page.
// Replace with a real API response later — the shape (InvestigationCase)
// is the contract components already expect, so this swap should not
// require touching component code.

const sources: Source[] = [
  {
    id: "src-1",
    name: "AlphaBay Reloaded",
    type: "marketplace",
    observedAt: "2025-11-02",
    reliability: "high",
  },
  {
    id: "src-2",
    name: "Dread Forum",
    type: "forum",
    observedAt: "2025-12-14",
    reliability: "medium",
  },
  {
    id: "src-3",
    name: "Encrypted Telegram Channel",
    type: "telegram",
    observedAt: "2026-01-08",
    reliability: "medium",
  },
  {
    id: "src-4",
    name: "Leaked Vendor DB",
    type: "leak",
    observedAt: "2026-01-22",
    reliability: "high",
  },
];

const infrastructure: InfrastructureFinding[] = [
  {
    id: "infra-1",
    onionAddress: "foxmarketxyzabc123def456.onion",
    misconfigurationType: "ssl_certificate_reuse",
    description:
      "TLS certificate served on the hidden service shares its serial number and issuer chain with a certificate observed on a clearnet host, indicating shared origin infrastructure.",
    likelyOriginIp: "185.220.101.47",
    likelyOriginDomain: "fox-market-mirror.com",
    confidence: "high",
    detectedAt: "2026-01-19",
  },
  {
    id: "infra-2",
    onionAddress: "foxmarketxyzabc123def456.onion",
    misconfigurationType: "exposed_server_status",
    description:
      "The '/server-status' Apache module was left publicly accessible, leaking internal request logs and a LAN IP range used in reverse-proxy configuration.",
    confidence: "medium",
    detectedAt: "2026-01-20",
  },
  {
    id: "infra-3",
    onionAddress: "foxmarketxyzabc123def456.onion",
    misconfigurationType: "descriptor_inconsistency",
    description:
      "Hidden service descriptor rotation interval does not match expected Tor defaults, consistent with a misconfigured or outdated relay setup previously seen on a known clearnet-hosted panel.",
    confidence: "low",
    detectedAt: "2026-02-01",
  },
];

export const mockCase: InvestigationCase = {
  actor: {
    id: "actor-1",
    handle: "shadowfox77",
    aliases: [
      { handle: "fox_vendor", platform: "AlphaBay Reloaded" },
      { handle: "sf77_market", platform: "Dread Forum" },
      { handle: "greyfox", platform: "Telegram" },
    ],
    category: "vendor",
    attributionConfidence: "high",
    firstSeen: "2024-06-11",
    lastSeen: "2026-01-22",
    lastScanDate: "2026-02-14",
    summary:
      "Vendor account associated with the sale of stolen payment card data and access credentials. Cross-platform activity links this handle to at least two other marketplace identities via shared PGP key material and wallet reuse.",
    pgpKeys: [
      {
        keyId: "0x9F3A21BC",
        fingerprint: "4A2B 9F3A 21BC 7E10 88CC  1F02 5D6E 40A1 9B3C 7E10",
        createdAt: "2024-05-02",
        verified: true,
      },
      {
        keyId: "0x77D0E4F2",
        fingerprint: "11C3 77D0 E4F2 90AB 3D5E  6F70 8899 AABB CCDD 1234",
        createdAt: "2025-09-19",
        verified: false,
      },
    ],
    wallets: [
      {
        address: "bc1q9f2xk3llq7z8m4v2p0e6a3s9d7f1g2h3j4k5l",
        currency: "BTC",
        label: "Primary payout",
      },
      {
        address: "0x8f4B2eC1a9D3f6C0b1A2e3D4f5A6b7C8d9E0f1A2",
        currency: "ETH",
      },
      {
        address: "48edfHu7V9z2s3Q1x9d2LWEs...monero",
        currency: "XMR",
        label: "Escrow",
      },
    ],
    identifiers: [
      { type: "domain", value: "fox-market-mirror.onion" },
      { type: "email", value: "sf77.contact@protonmail.com" },
      { type: "username", value: "greyfox_dev" },
    ],
    sourceIds: ["src-1", "src-2", "src-3", "src-4"],
  },
  sources,
  infrastructure,
  relationships: {
    nodes: [
      { id: "actor-1", label: "shadowfox77", type: "actor" },
      { id: "alias-1", label: "fox_vendor", type: "alias" },
      { id: "alias-2", label: "sf77_market", type: "alias" },
      { id: "alias-3", label: "greyfox", type: "alias" },
      { id: "pgp-1", label: "0x9F3A21BC", type: "pgp" },
      { id: "wallet-1", label: "bc1q9f2x...4k5l", type: "wallet" },
      { id: "src-1", label: "AlphaBay Reloaded", type: "source" },
      { id: "entity-1", label: "coldwave_vendor", type: "entity" },
    ],
    edges: [
      { sourceId: "actor-1", targetId: "alias-1", relation: "known as" },
      { sourceId: "actor-1", targetId: "alias-2", relation: "known as" },
      { sourceId: "actor-1", targetId: "alias-3", relation: "known as" },
      { sourceId: "actor-1", targetId: "pgp-1", relation: "uses key" },
      { sourceId: "actor-1", targetId: "wallet-1", relation: "controls" },
      { sourceId: "alias-1", targetId: "src-1", relation: "active on" },
      { sourceId: "entity-1", targetId: "pgp-1", relation: "shares key" },
      { sourceId: "entity-1", targetId: "wallet-1", relation: "shares wallet" },
    ],
  },
  evidence: [
    {
      id: "ev-1",
      relationshipLabel: "shadowfox77 ↔ coldwave_vendor",
      evidenceType: "shared_pgp",
      description:
        "Both identities signed marketplace listings with PGP key 0x9F3A21BC across a 3-week overlapping window.",
      confidence: "high",
    },
    {
      id: "ev-2",
      relationshipLabel: "shadowfox77 ↔ coldwave_vendor",
      evidenceType: "shared_wallet",
      description:
        "Payout wallet bc1q9f2x...4k5l received funds from both accounts' escrow releases on the same marketplace.",
      confidence: "confirmed",
    },
    {
      id: "ev-3",
      relationshipLabel: "fox_vendor ↔ greyfox",
      evidenceType: "stylometric",
      description:
        "Writing-style analysis of forum posts shows consistent phrasing patterns, punctuation habits, and vocabulary overlap above the similarity threshold.",
      confidence: "medium",
    },
    {
      id: "ev-4",
      relationshipLabel: "sf77_market ↔ AlphaBay Reloaded",
      evidenceType: "temporal_correlation",
      description:
        "Login and posting activity on both platforms consistently falls within the same 4-hour daily window, suggesting a shared operator timezone.",
      confidence: "low",
    },
  ],
  timeline: [
    {
      id: "tl-1",
      date: "2024-06-11",
      title: "First observed",
      description:
        "Handle 'shadowfox77' first indexed on AlphaBay Reloaded as a new vendor account.",
      sourceId: "src-1",
    },
    {
      id: "tl-2",
      date: "2024-05-02",
      title: "PGP key published",
      description:
        "Key 0x9F3A21BC added to vendor profile for encrypted buyer communication.",
      sourceId: "src-1",
    },
    {
      id: "tl-3",
      date: "2025-09-19",
      title: "Secondary PGP key generated",
      description:
        "New, unverified key 0x77D0E4F2 observed in a Dread Forum signature block.",
      sourceId: "src-2",
    },
    {
      id: "tl-4",
      date: "2025-12-14",
      title: "Cross-platform alias linked",
      description:
        "'sf77_market' identity on Dread Forum linked via shared wallet reuse.",
      sourceId: "src-2",
    },
    {
      id: "tl-5",
      date: "2026-01-22",
      title: "Leak corroboration",
      description:
        "Leaked vendor database confirms email identifier and reused wallet address.",
      sourceId: "src-4",
    },
  ],
  transactions: [
    {
      id: "tx-1",
      date: "2025-08-03",
      wallet: "bc1q9f2x...4k5l",
      amount: "0.42 BTC",
      status: "confirmed",
    },
    {
      id: "tx-2",
      date: "2025-09-21",
      wallet: "bc1q9f2x...4k5l",
      amount: "0.11 BTC",
      status: "confirmed",
    },
    {
      id: "tx-3",
      date: "2025-11-30",
      wallet: "0x8f4B2e...f1A2",
      amount: "2.30 ETH",
      status: "flagged",
    },
    {
      id: "tx-4",
      date: "2026-01-05",
      wallet: "bc1q9f2x...4k5l",
      amount: "0.07 BTC",
      status: "pending",
    },
    {
      id: "tx-5",
      date: "2026-01-22",
      wallet: "0x8f4B2e...f1A2",
      amount: "0.95 ETH",
      status: "confirmed",
    },
  ],
  attributionScore: {
  pgpKeyMatch: 92,
  walletReuse: 85,
  stylometricSimilarity: 68,
  temporalCorrelation: 54,
},
};

// Minimal mock for the Home page's "recent investigations" strip.
export const recentInvestigations = [
  {
    id: "actor-1",
    handle: "shadowfox77",
    category: "Vendor",
    lastSeen: "2026-01-22",
  },
  {
    id: "actor-2",
    handle: "nullreaper",
    category: "Ransomware operator",
    lastSeen: "2026-01-18",
  },
  {
    id: "actor-3",
    handle: "cinder_ops",
    category: "Forum admin",
    lastSeen: "2026-01-09",
  },
];
