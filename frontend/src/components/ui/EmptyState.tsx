import { SearchX } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  title = 'No results found',
  description = 'Try adjusting your search or filters.',
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-14 h-14 rounded-2xl bg-surface-100 dark:bg-dark-50/30 flex items-center justify-center mb-4">
        <SearchX className="w-7 h-7 text-surface-400 dark:text-surface-500" />
      </div>
      <h3 className="text-base font-semibold text-surface-800 dark:text-surface-200 mb-1">{title}</h3>
      <p className="text-sm text-surface-500 dark:text-surface-400 max-w-sm">{description}</p>
      {action && (
        <button onClick={action.onClick} className="btn-primary mt-4 text-sm">
          {action.label}
        </button>
      )}
    </div>
  );
}
