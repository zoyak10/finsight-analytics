import { CheckCircle, Clock } from 'lucide-react';
import type { DashboardSummary } from '../../types';

interface StatusDistributionProps {
  summary: DashboardSummary;
}

export function StatusDistribution({ summary }: StatusDistributionProps) {
  const total = summary.paidCount + summary.pendingCount;
  const paidPct = total > 0 ? ((summary.paidCount / total) * 100).toFixed(1) : '0';
  const pendingPct = total > 0 ? ((summary.pendingCount / total) * 100).toFixed(1) : '0';

  return (
    <div className="card p-5 animate-fade-in">
      <h3 className="text-base font-semibold text-surface-800 dark:text-surface-100 mb-4">Transaction Status</h3>

      {/* Stacked bar */}
      <div className="w-full h-3 bg-surface-100 dark:bg-dark-50/30 rounded-full overflow-hidden flex mb-4">
        <div
          className="h-full bg-emerald-500 dark:bg-neon-emerald transition-all duration-700"
          style={{
            width: `${paidPct}%`,
            boxShadow: '0 0 8px rgba(52, 211, 153, 0.3)',
          }}
        />
        <div
          className="h-full bg-amber-400 dark:bg-neon-amber transition-all duration-700"
          style={{
            width: `${pendingPct}%`,
            boxShadow: '0 0 8px rgba(251, 191, 36, 0.3)',
          }}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3 p-3 bg-emerald-50/50 dark:bg-emerald-500/10 rounded-xl border border-emerald-100 dark:border-emerald-500/20 transition-colors">
          <CheckCircle className="w-5 h-5 text-emerald-500 dark:text-neon-emerald" />
          <div>
            <p className="text-lg font-bold text-surface-900 dark:text-white">{summary.paidCount}</p>
            <p className="text-xs text-surface-500 dark:text-surface-400">Paid ({paidPct}%)</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-amber-50/50 dark:bg-amber-500/10 rounded-xl border border-amber-100 dark:border-amber-500/20 transition-colors">
          <Clock className="w-5 h-5 text-amber-500 dark:text-neon-amber" />
          <div>
            <p className="text-lg font-bold text-surface-900 dark:text-white">{summary.pendingCount}</p>
            <p className="text-xs text-surface-500 dark:text-surface-400">Pending ({pendingPct}%)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
