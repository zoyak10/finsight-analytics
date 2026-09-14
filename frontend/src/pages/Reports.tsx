import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FileBarChart, FileDown, Table, Calendar, Sparkles } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { ExportReportModal } from '../components/reports/ExportReportModal';
import { getTransactions } from '../services/api/transactions';

export function ReportsPage() {
  const [exportModalOpen, setExportModalOpen] = useState(false);

  const { data } = useQuery({
    queryKey: ['transactions', { page: 1, limit: 1 }],
    queryFn: () => getTransactions({ page: 1, limit: 1 }),
    staleTime: 30000,
  });

  const totalRecords = data?.pagination?.total || 0;

  return (
    <div className="animate-fade-in">
      <Header
        title="Reports"
        subtitle="Generate and download financial reports."
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Export card */}
        <div
          className="card-hover p-6 cursor-pointer group neon-border"
          onClick={() => setExportModalOpen(true)}
        >
          <div className="w-12 h-12 bg-brand-50 dark:bg-brand-500/15 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            <FileDown className="w-6 h-6 text-brand-600 dark:text-neon-violet" />
          </div>
          <h3 className="text-base font-semibold text-surface-800 dark:text-surface-100">Transaction Export</h3>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1.5">
            Generate a CSV report with configurable columns and active filters.
          </p>
          <div className="mt-4 flex items-center gap-4 text-xs text-surface-400 dark:text-surface-500">
            <span className="flex items-center gap-1">
              <Table className="w-3.5 h-3.5" />
              {totalRecords} records available
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Jan – Dec 2024
            </span>
          </div>
        </div>

        {/* Info card */}
        <div className="card p-6 border-dashed border-surface-300 dark:border-white/10">
          <div className="w-12 h-12 bg-surface-100 dark:bg-dark-50/30 rounded-xl flex items-center justify-center mb-4">
            <FileBarChart className="w-6 h-6 text-surface-400 dark:text-surface-500" />
          </div>
          <h3 className="text-base font-semibold text-surface-800 dark:text-surface-100">Custom Reports</h3>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1.5">
            Advanced reporting with scheduled generation and email delivery — coming soon.
          </p>
          <div className="mt-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-50 dark:bg-brand-500/10 text-xs font-medium text-brand-600 dark:text-neon-violet">
            <Sparkles className="w-3 h-3" />
            Coming Soon
          </div>
        </div>
      </div>

      <ExportReportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        filters={{}}
        recordCount={totalRecords}
      />
    </div>
  );
}
