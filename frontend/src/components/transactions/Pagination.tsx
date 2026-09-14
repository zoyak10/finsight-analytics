import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export function Pagination({ page, totalPages, total, limit, onPageChange, onLimitChange }: PaginationProps) {
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-surface-200 dark:border-white/[0.06]">
      <div className="flex items-center gap-2 text-xs sm:text-sm text-surface-500 dark:text-surface-400">
        <span>
          Showing <span className="font-medium text-surface-700 dark:text-surface-200">{start}</span>–
          <span className="font-medium text-surface-700 dark:text-surface-200">{end}</span> of{' '}
          <span className="font-medium text-surface-700 dark:text-surface-200">{total}</span> results
        </span>
      </div>

      <div className="flex items-center justify-between w-full sm:w-auto gap-3">
        <div className="flex items-center gap-1.5">
          <label htmlFor="rows-per-page" className="text-xs text-surface-500 dark:text-surface-400">Rows:</label>
          <select
            id="rows-per-page"
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="text-xs border border-surface-300 dark:border-dark-50/40 rounded-lg px-2 py-1.5 bg-white dark:bg-dark-200/80 text-surface-700 dark:text-surface-200 focus:outline-none focus:ring-2 focus:ring-brand-500/40 transition-colors"
          >
            {[10, 20, 50].map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="p-2 sm:p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-dark-50/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors active:scale-95"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4 text-surface-600 dark:text-surface-400" />
          </button>

          <span className="text-xs sm:text-sm text-surface-600 dark:text-surface-300 px-2 min-w-[70px] sm:min-w-[80px] text-center">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="p-2 sm:p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-dark-50/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors active:scale-95"
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4 text-surface-600 dark:text-surface-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
