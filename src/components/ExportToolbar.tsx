// USE: Export buttons (CSV, JSON) shown on the Investigation page once
// an actor is found. Client-side only — builds a file in-browser and
// triggers a download. No backend needed.

import type { InvestigationCase } from "../data/types";

interface ExportToolbarProps {
  data: InvestigationCase;
}

function downloadFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function toCsv(data: InvestigationCase): string {
  const { actor } = data;
  const rows: string[][] = [
    ["Field", "Value"],
    ["Handle", actor.handle],
    ["Category", actor.category],
    ["Attribution Confidence", actor.attributionConfidence],
    ["First Seen", actor.firstSeen],
    ["Last Seen", actor.lastSeen],
    ["Last Scan Date", actor.lastScanDate],
    ["Aliases", actor.aliases.map((a) => a.handle).join(" | ")],
    ["PGP Keys", actor.pgpKeys.map((k) => k.keyId).join(" | ")],
    [
      "Wallets",
      actor.wallets.map((w) => `${w.currency}:${w.address}`).join(" | "),
    ],
    [
      "Identifiers",
      actor.identifiers.map((i) => `${i.type}:${i.value}`).join(" | "),
    ],
    ["Sources", data.sources.map((s) => s.name).join(" | ")],
  ];

  return rows
    .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
    .join("\n");
}

const secondaryButton =
  "rounded-full border border-line bg-card-raised px-3.5 py-1.5 text-xs font-medium text-fg-muted transition-all duration-200 hover:border-line-strong hover:text-fg active:scale-[0.97]";

export default function ExportToolbar({ data }: ExportToolbarProps) {
  const handleExportCsv = () => {
    downloadFile(`${data.actor.handle}_report.csv`, toCsv(data), "text/csv");
  };

  const handleExportJson = () => {
    downloadFile(
      `${data.actor.handle}_report.json`,
      JSON.stringify(data, null, 2),
      "application/json",
    );
  };

  return (
    <div className="flex flex-wrap items-center gap-2 no-print">
      <button type="button" onClick={handleExportCsv} className={secondaryButton}>
        Export CSV
      </button>
      <button type="button" onClick={handleExportJson} className={secondaryButton}>
        Export JSON
      </button>
      <button
        type="button"
        onClick={() => window.print()}
        className="rounded-full border border-accent/40 bg-accent/10 px-3.5 py-1.5 text-xs font-medium text-accent transition-all duration-200 hover:border-accent/70 hover:bg-accent/20 active:scale-[0.97]"
      >
        Export Report
      </button>
    </div>
  );
}