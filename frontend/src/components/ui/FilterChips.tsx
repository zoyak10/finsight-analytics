import { X } from 'lucide-react';

interface FilterChip {
  key: string;
  label: string;
  value: string;
}

interface FilterChipsProps {
  filters: FilterChip[];
  onRemove: (key: string) => void;
  onClearAll: () => void;
}

export function FilterChips({ filters, onRemove, onClearAll }: FilterChipsProps) {
  if (filters.length === 0) return null;

  return (
    <div className="flex items-center flex-wrap gap-2">
      <span className="text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Active filters:</span>
      {filters.map((filter) => (
        <span
          key={filter.key}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-neon-violet rounded-lg ring-1 ring-inset ring-brand-200 dark:ring-brand-500/20"
        >
          <span className="text-brand-500 dark:text-brand-400">{filter.label}:</span>
          {filter.value}
          <button
            onClick={() => onRemove(filter.key)}
            className="ml-0.5 p-0.5 rounded hover:bg-brand-100 dark:hover:bg-brand-500/20 transition-colors"
            aria-label={`Remove ${filter.label} filter`}
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
      <button
        onClick={onClearAll}
        className="text-xs font-medium text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 underline underline-offset-2 transition-colors"
      >
        Clear all
      </button>
    </div>
  );
}
