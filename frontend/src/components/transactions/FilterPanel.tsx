import { useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';

interface FilterPanelProps {
  filters: {
    startDate: string;
    endDate: string;
    minAmount: string;
    maxAmount: string;
    category: string;
    status: string;
    userId: string;
  };
  users: string[];
  onChange: (key: string, value: string) => void;
  onClear: () => void;
}

export function FilterPanel({ filters, users, onChange, onClear }: FilterPanelProps) {
  const [open, setOpen] = useState(false);

  const hasFilters = Object.values(filters).some((v) => v !== '');

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`btn-secondary relative ${hasFilters ? 'ring-2 ring-brand-500/50 border-brand-300 dark:ring-brand-400/30 dark:border-brand-400/40' : ''}`}
        aria-label="Toggle filters"
        aria-expanded={open}
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filters
        {hasFilters && (
          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-gradient-to-r from-brand-500 to-brand-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-glow-sm">
            {Object.values(filters).filter((v) => v !== '').length}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30 bg-black/20 dark:bg-black/40 backdrop-blur-[2px] sm:bg-transparent sm:backdrop-blur-none" onClick={() => setOpen(false)} />
          <div className="fixed inset-x-4 top-20 sm:absolute sm:inset-x-auto sm:right-0 sm:top-12 z-40 w-auto sm:w-80 max-w-[calc(100vw-2rem)] max-h-[85vh] overflow-y-auto bg-white/95 dark:bg-dark-200/95 backdrop-blur-2xl rounded-2xl border border-surface-200 dark:border-white/[0.08] shadow-2xl p-4 animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-surface-800 dark:text-surface-100">Filters</h3>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-dark-50/30 transition-colors"
                aria-label="Close filters"
              >
                <X className="w-4 h-4 text-surface-500 dark:text-surface-400" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Date range */}
              <div>
                <label className="label">Date Range</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => onChange('startDate', e.target.value)}
                    className="input text-sm sm:text-xs"
                    aria-label="Start date"
                  />
                  <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => onChange('endDate', e.target.value)}
                    className="input text-sm sm:text-xs"
                    aria-label="End date"
                  />
                </div>
              </div>

              {/* Amount range */}
              <div>
                <label className="label">Amount Range (₹)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={filters.minAmount}
                    onChange={(e) => onChange('minAmount', e.target.value)}
                    placeholder="Min"
                    className="input text-sm sm:text-xs"
                    min="0"
                    aria-label="Minimum amount"
                  />
                  <input
                    type="number"
                    value={filters.maxAmount}
                    onChange={(e) => onChange('maxAmount', e.target.value)}
                    placeholder="Max"
                    className="input text-sm sm:text-xs"
                    min="0"
                    aria-label="Maximum amount"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="label">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => onChange('category', e.target.value)}
                  className="input text-sm sm:text-xs"
                  aria-label="Category filter"
                >
                  <option value="">All Categories</option>
                  <option value="Revenue">Revenue</option>
                  <option value="Expense">Expense</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="label">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => onChange('status', e.target.value)}
                  className="input text-sm sm:text-xs"
                  aria-label="Status filter"
                >
                  <option value="">All Statuses</option>
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              {/* User */}
              <div>
                <label className="label">User</label>
                <select
                  value={filters.userId}
                  onChange={(e) => onChange('userId', e.target.value)}
                  className="input text-sm sm:text-xs"
                  aria-label="User filter"
                >
                  <option value="">All Users</option>
                  {users.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
            </div>

            {hasFilters && (
              <button
                onClick={onClear}
                className="w-full mt-4 text-xs font-medium text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 py-2 border-t border-surface-100 dark:border-white/[0.06] transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
