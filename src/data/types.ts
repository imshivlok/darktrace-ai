// Core domain types for DarkTrace.
// This file has no backend dependency — it's the shared contract between
// mock data (today) and real API responses (later). Keep components typed
// against these interfaces so swapping the data source is a non-event.

export type AttributionConfidence = "low" | "medium" | "high" | "confirmed";

export type ActorCategory =
  | "vendor"
  | "forum_admin"
  | "hacker"
  | "scammer"
  | "ransomware_operator"
  | "unknown";

export interface Alias {
  handle: string;
  platform?: string;
}
export interface AttributionScoreBreakdown {
  pgpKeyMatch: number; // 0-100
  walletReuse: number;
  stylometricSimilarity: number;
  temporalCorrelation: number;
}

export interface PGPKey {
  fingerprint: string;
  keyId: string;
  createdAt?: string;
  verified: boolean;
}

export interface Wallet {
  address: string;
  currency: "BTC" | "ETH" | "XMR" | "USDT" | string;
  label?: string;
}

export interface Identifier {
  type: "domain" | "email" | "ip" | "username" | "phone" | string;
  value: string;
}

export type SourceType =
  | "marketplace"
  | "forum"
  | "telegram"
  | "paste_site"
  | "leak"
  | "osint";

export type Reliability = "unverified" | "low" | "medium" | "high";

export interface Source {
  id: string;
  name: string;
  type: SourceType;
  observedAt: string; // ISO date
  reliability: Reliability;
}

export interface ThreatActor {
  id: string;
  handle: string;
  aliases: Alias[];
  category: ActorCategory;
  attributionConfidence: AttributionConfidence;
  firstSeen: string; // ISO date
  lastSeen: string; // ISO date
  lastScanDate: string; // ISO date — most recent automated collection pass
  summary?: string;
  pgpKeys: PGPKey[];
  wallets: Wallet[];
  identifiers: Identifier[];
  sourceIds: string[]; // references into Source[]
}

// --- Infrastructure / Tor misconfiguration mapping ---
// Core capability #1: exposed configuration on a .onion service that leaks
// signal tying it back to a clearnet origin server.

export type MisconfigurationType =
  | "exposed_server_status"
  | "ssl_certificate_reuse"
  | "default_banner"
  | "descriptor_inconsistency"
  | "shared_favicon_hash"
  | "leaked_header";

export interface InfrastructureFinding {
  id: string;
  onionAddress: string;
  misconfigurationType: MisconfigurationType;
  description: string;
  likelyOriginIp?: string;
  likelyOriginDomain?: string;
  confidence: AttributionConfidence;
  detectedAt: string; // ISO date
}

export type RelationshipNodeType =
  | "actor"
  | "alias"
  | "pgp"
  | "wallet"
  | "source"
  | "entity";

export interface RelationshipNode {
  id: string;
  label: string;
  type: RelationshipNodeType;
}

export interface RelationshipEdge {
  sourceId: string;
  targetId: string;
  relation: string; // human-readable, e.g. "uses key"
}

export interface RelationshipGraphData {
  nodes: RelationshipNode[];
  edges: RelationshipEdge[];
}

export type EvidenceType =
  | "stylometric"
  | "shared_pgp"
  | "shared_wallet"
  | "temporal_correlation"
  | "infrastructure_overlap"
  | "manual_analyst";

export interface EvidenceItem {
  id: string;
  relationshipLabel: string; // e.g. "shadowfox77 ↔ wallet bc1q9f2..."
  evidenceType: EvidenceType;
  description: string;
  confidence: AttributionConfidence;
}

export interface TimelineEvent {
  id: string;
  date: string; // ISO date
  title: string;
  description: string;
  sourceId?: string;
}

export type TransactionStatus = "confirmed" | "pending" | "flagged";

export interface Transaction {
  id: string;
  date: string; // ISO date
  wallet: string;
  amount: string; // pre-formatted, e.g. "0.42 BTC"
  status: TransactionStatus;
}

// Aggregate shape the Investigation page ultimately needs.
// The backend will eventually return something shaped like this from one
// "get case" endpoint; for now it's assembled from mock data.
export interface InvestigationCase {
  actor: ThreatActor;
  sources: Source[];
  infrastructure: InfrastructureFinding[];
  relationships: RelationshipGraphData;
  evidence: EvidenceItem[];
  timeline: TimelineEvent[];
  transactions: Transaction[];
  attributionScore: AttributionScoreBreakdown;
}
