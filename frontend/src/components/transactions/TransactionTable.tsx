import { ArrowUpDown, ArrowUp, ArrowDown, ExternalLink } from 'lucide-react';
import type { Transaction } from '../../types';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/date';
import { StatusBadge } from '../ui/StatusBadge';
import { LoadingSkeleton } from '../ui/LoadingSkeleton';
import { EmptyState } from '../ui/EmptyState';

interface TransactionTableProps {
  data: Transaction[];
  isLoading: boolean;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSort: (field: string) => void;
  onClearFilters?: () => void;
}

const COLUMNS = [
  { key: 'id', label: 'ID', sortable: true, width: 'w-16' },
  { key: 'date', label: 'Date', sortable: true, width: 'w-28' },
  { key: 'amount', label: 'Amount', sortable: true, width: 'w-28' },
  { key: 'category', label: 'Category', sortable: true, width: 'w-24' },
  { key: 'status', label: 'Status', sortable: true, width: 'w-24' },
  { key: 'user_id', label: 'User', sortable: true, width: 'w-24' },
  { key: 'user_profile', label: 'Profile', sortable: false, width: 'w-16' },
];

function SortIcon({ field, sortBy, sortOrder }: { field: string; sortBy: string; sortOrder: string }) {
  if (field !== sortBy) return <ArrowUpDown className="w-3.5 h-3.5 text-surface-300 dark:text-surface-600" />;
  return sortOrder === 'asc' ? (
    <ArrowUp className="w-3.5 h-3.5 text-brand-600 dark:text-neon-violet" />
  ) : (
    <ArrowDown className="w-3.5 h-3.5 text-brand-600 dark:text-neon-violet" />
  );
}

export function TransactionTable({
  data,
  isLoading,
  sortBy,
  sortOrder,
  onSort,
  onClearFilters,
}: TransactionTableProps) {
  if (!isLoading && data.length === 0) {
    return (
      <EmptyState
        title="No transactions match your filters"
        description="Try removing one or more filters to see results."
        action={onClearFilters ? { label: 'Clear filters', onClick: onClearFilters } : undefined}
      />
    );
  }

  return (
    <div>
      {/* Mobile Card List (visible on screens smaller than md) */}
      <div className="block md:hidden divide-y divide-surface-100 dark:divide-white/[0.06]">
        {isLoading ? (
          <div className="p-4 space-y-3">
            <LoadingSkeleton variant="card" count={4} />
          </div>
        ) : (
          data.map((txn) => (
            <div
              key={txn._id}
              className="p-4 space-y-2.5 hover:bg-surface-50/50 dark:hover:bg-white/[0.02] transition-colors"
            >
              {/* Top: ID, Date, Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-surface-100 dark:bg-dark-50/50 text-surface-600 dark:text-surface-300">
                    #{txn.id}
                  </span>
                  <span className="text-xs text-surface-500 dark:text-surface-400">
                    {formatDate(txn.date)}
                  </span>
                </div>
                <StatusBadge status={txn.status} />
              </div>

              {/* Middle: Amount & Category */}
              <div className="flex items-center justify-between pt-0.5">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-lg ${
                    txn.category === 'Revenue'
                      ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-neon-emerald'
                      : 'bg-red-50 dark:bg-rose-500/10 text-red-700 dark:text-neon-rose'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      txn.category === 'Revenue'
                        ? 'bg-emerald-500 dark:bg-neon-emerald'
                        : 'bg-red-500 dark:bg-neon-rose'
                    }`} />
                    {txn.category}
                  </span>
                </div>

                <span className={`text-base font-bold ${
                  txn.category === 'Revenue'
                    ? 'text-emerald-600 dark:text-neon-emerald'
                    : 'text-red-600 dark:text-neon-rose'
                }`}>
                  {txn.category === 'Revenue' ? '+' : '-'}{formatCurrency(txn.amount)}
                </span>
              </div>

              {/* Bottom: User ID & Profile link */}
              <div className="flex items-center justify-between text-xs pt-1 border-t border-surface-100/60 dark:border-white/[0.03]">
                <span className="text-surface-500 dark:text-surface-400 font-mono">
                  User: <span className="font-medium text-surface-700 dark:text-surface-300">{txn.user_id}</span>
                </span>
                <a
                  href={txn.user_profile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-brand-600 dark:text-neon-violet hover:text-brand-700 dark:hover:text-brand-300 font-medium transition-colors py-1 px-2 -mr-2 rounded-lg hover:bg-surface-100 dark:hover:bg-dark-50/30"
                  aria-label={`View ${txn.user_id} profile`}
                >
                  Profile
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View (hidden on mobile, visible on md+) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm" role="table">
          <thead>
            <tr className="border-b border-surface-200 dark:border-white/[0.06]">
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-left text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider ${col.width}`}
                >
                  {col.sortable ? (
                    <button
                      onClick={() => onSort(col.key)}
                      className="inline-flex items-center gap-1.5 hover:text-surface-700 dark:hover:text-surface-200 transition-colors"
                      aria-label={`Sort by ${col.label}`}
                    >
                      {col.label}
                      <SortIcon field={col.key} sortBy={sortBy} sortOrder={sortOrder} />
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-100 dark:divide-white/[0.04]">
            {isLoading ? (
              <LoadingSkeleton variant="row" count={10} />
            ) : (
              data.map((txn) => (
                <tr
                  key={txn._id}
                  className="hover:bg-surface-50/50 dark:hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs text-surface-500 dark:text-surface-400">#{txn.id}</span>
                  </td>
                  <td className="px-4 py-3 text-surface-700 dark:text-surface-300">{formatDate(txn.date)}</td>
                  <td className="px-4 py-3">
                    <span className={`font-semibold ${
                      txn.category === 'Revenue'
                        ? 'text-emerald-600 dark:text-neon-emerald'
                        : 'text-red-600 dark:text-neon-rose'
                    }`}>
                      {txn.category === 'Revenue' ? '+' : '-'}{formatCurrency(txn.amount)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                      txn.category === 'Revenue'
                        ? 'text-emerald-700 dark:text-neon-emerald'
                        : 'text-red-700 dark:text-neon-rose'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        txn.category === 'Revenue'
                          ? 'bg-emerald-500 dark:bg-neon-emerald dark:shadow-glow-emerald'
                          : 'bg-red-500 dark:bg-neon-rose dark:shadow-glow-rose'
                      }`} />
                      {txn.category}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={txn.status} />
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs text-surface-600 dark:text-surface-400">{txn.user_id}</span>
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={txn.user_profile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-brand-600 dark:text-neon-violet hover:text-brand-700 dark:hover:text-brand-300 text-xs transition-colors"
                      aria-label={`View ${txn.user_id} profile`}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
