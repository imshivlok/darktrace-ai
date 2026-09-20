// USE: Table of wallet transactions tied to the actor — ID, date, wallet,
// amount, and status (confirmed/pending/flagged). Sits below EvidencePanel
// / Timeline on the Investigation page.

import type { Transaction, TransactionStatus } from "../data/types";

interface TransactionsTableProps {
  transactions: Transaction[];
}

const statusStyles: Record<TransactionStatus, string> = {
  confirmed: "text-ok bg-ok/10 border-ok/30",
  pending: "text-warn bg-warn/10 border-warn/30",
  flagged: "text-danger bg-danger/10 border-danger/30",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function TransactionsTable({
  transactions,
}: TransactionsTableProps) {
  return (
    <section className="rounded-2xl border border-line-faint bg-band/60 p-4 sm:p-6">
      <h2 className="mb-4 text-sm font-medium text-fg">
        Wallet transactions
      </h2>

      <div className="scroll-thin overflow-x-auto">
        <table className="w-full min-w-130 border-collapse text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs text-fg-subtle">
              <th className="pb-2 pr-4 font-medium">Transaction ID</th>
              <th className="pb-2 pr-4 font-medium">Date</th>
              <th className="pb-2 pr-4 font-medium">Wallet</th>
              <th className="pb-2 pr-4 font-medium">Amount</th>
              <th className="pb-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr
                key={tx.id}
                className="border-b border-line-faint transition-colors duration-150 hover:bg-fg/[0.03]"
              >
                <td className="py-2.5 pr-4 font-mono text-xs text-fg-muted">
                  {tx.id}
                </td>
                <td className="py-2.5 pr-4 font-mono text-xs text-fg-muted">
                  {formatDate(tx.date)}
                </td>
                <td className="py-2.5 pr-4 font-mono text-xs text-fg-muted">
                  {tx.wallet}
                </td>
                <td className="py-2.5 pr-4 font-mono text-xs text-fg">
                  {tx.amount}
                </td>
                <td className="py-2.5">
                  <span
                    className={`rounded-md border px-2 py-0.5 text-[11px] font-medium ${statusStyles[tx.status]}`}
                  >
                    {tx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}