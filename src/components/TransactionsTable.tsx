// USE: Table of wallet transactions tied to the actor — ID, date, wallet,
// amount, and status (confirmed/pending/flagged). Sits below EvidencePanel
// / Timeline on the Investigation page.

import type { Transaction, TransactionStatus } from "../data/types";

interface TransactionsTableProps {
  transactions: Transaction[];
}

const statusStyles: Record<TransactionStatus, string> = {
  confirmed: "text-emerald-300 bg-emerald-500/10 border-emerald-500/30",
  pending: "text-amber-300 bg-amber-500/10 border-amber-500/30",
  flagged: "text-red-300 bg-red-500/10 border-red-500/30",
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
    <section className="rounded-2xl border border-slate-700/50 bg-[#111214]/70 backdrop-blur-xl p-4 sm:p-6">
      <h2 className="mb-4 text-sm font-medium text-slate-300">
        Wallet transactions
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full min-w-130 border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-700/50 text-left text-xs text-slate-500">
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
                className="border-b border-slate-800/60 transition-colors duration-150 hover:bg-slate-800/20"
              >
                <td className="py-2.5 pr-4 font-mono text-xs text-slate-300">
                  {tx.id}
                </td>
                <td className="py-2.5 pr-4 font-mono text-xs text-slate-400">
                  {formatDate(tx.date)}
                </td>
                <td className="py-2.5 pr-4 font-mono text-xs text-slate-400">
                  {tx.wallet}
                </td>
                <td className="py-2.5 pr-4 font-mono text-xs text-slate-200">
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
