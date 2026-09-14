import { useState } from 'react';
import { X, FileDown, Check, Loader2 } from 'lucide-react';
import { useToast } from '../ui/Toast';
import { exportReport } from '../../services/api/reports';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: Record<string, string>;
  recordCount: number;
}

const AVAILABLE_FIELDS = [
  { field: 'id', label: 'Transaction ID' },
  { field: 'date', label: 'Date' },
  { field: 'amount', label: 'Amount (₹)' },
  { field: 'category', label: 'Category' },
  { field: 'status', label: 'Status' },
  { field: 'user_id', label: 'User ID' },
  { field: 'user_profile', label: 'User Profile' },
];

export function ExportReportModal({ isOpen, onClose, filters, recordCount }: ExportReportModalProps) {
  const [selected, setSelected] = useState<Set<string>>(
    new Set(AVAILABLE_FIELDS.map((f) => f.field))
  );
  const [isExporting, setIsExporting] = useState(false);
  const { addToast } = useToast();

  if (!isOpen) return null;

  const toggleField = (field: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(field)) {
        next.delete(field);
      } else {
        next.add(field);
      }
      return next;
    });
  };

  const selectAll = () => setSelected(new Set(AVAILABLE_FIELDS.map((f) => f.field)));
  const clearAll = () => setSelected(new Set());

  const handleExport = async () => {
    if (selected.size === 0) {
      addToast('warning', 'Please select at least one column');
      return;
    }

    setIsExporting(true);
    try {
      // Build clean filters
      const cleanFilters: Record<string, string | number> = {};
      Object.entries(filters).forEach(([k, v]) => {
        if (v !== '' && v !== undefined) cleanFilters[k] = v;
      });

      const blob = await exportReport({
        columns: Array.from(selected),
        filters: cleanFilters,
      });

      // Trigger download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const today = new Date().toISOString().split('T')[0];
      a.href = url;
      a.download = `finsight-report-${today}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      addToast('success', 'Report downloaded successfully');
      onClose();
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Failed to generate report';
      addToast('error', msg);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-50 transition-opacity" onClick={onClose} />

      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
        <div
          className="bg-white dark:bg-dark-200 rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] flex flex-col border border-surface-200 dark:border-white/[0.08] overflow-hidden animate-scale-in"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="export-modal-title"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-surface-200 dark:border-white/[0.06] flex-shrink-0">
            <div>
              <h2 id="export-modal-title" className="text-base sm:text-lg font-semibold text-surface-900 dark:text-white">
                Build your report
              </h2>
              <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">
                Select columns to include in the CSV export
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-dark-50/30 text-surface-500 dark:text-surface-400 transition-colors"
              aria-label="Close export modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="px-5 sm:px-6 py-4 overflow-y-auto flex-1">
            {/* Quick actions */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs sm:text-sm font-medium text-surface-700 dark:text-surface-300">
                {selected.size} of {AVAILABLE_FIELDS.length} columns selected
              </span>
              <div className="flex gap-2">
                <button onClick={selectAll} className="text-xs font-medium text-brand-600 dark:text-neon-violet hover:underline">
                  Select all
                </button>
                <span className="text-surface-300 dark:text-surface-600">·</span>
                <button onClick={clearAll} className="text-xs font-medium text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-200">
                  Clear all
                </button>
              </div>
            </div>

            {/* Field list */}
            <div className="space-y-1.5 max-h-56 sm:max-h-64 overflow-y-auto pr-0.5">
              {AVAILABLE_FIELDS.map((field) => {
                const isSelected = selected.has(field.field);
                return (
                  <label
                    key={field.field}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-brand-50/80 dark:bg-brand-500/15 border border-brand-200 dark:border-brand-500/30'
                        : 'bg-surface-50/80 dark:bg-dark-100/40 border border-transparent hover:bg-surface-100 dark:hover:bg-dark-50/30'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-brand-600 dark:bg-neon-violet'
                          : 'bg-white dark:bg-dark-300 border-2 border-surface-300 dark:border-dark-50'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleField(field.field)}
                      className="sr-only"
                      aria-label={`Include ${field.label}`}
                    />
                    <span className="text-xs sm:text-sm font-medium text-surface-700 dark:text-surface-200">{field.label}</span>
                    <span className="text-[11px] text-surface-400 dark:text-surface-500 ml-auto font-mono">{field.field}</span>
                  </label>
                );
              })}
            </div>

            {/* Preview info */}
            <div className="mt-4 px-3.5 py-2.5 bg-surface-50 dark:bg-dark-100/40 rounded-xl border border-surface-100 dark:border-white/[0.04]">
              <div className="flex items-center justify-between text-xs">
                <span className="text-surface-500 dark:text-surface-400">Estimated records</span>
                <span className="font-semibold text-surface-700 dark:text-surface-200">{recordCount.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-xs mt-1.5">
                <span className="text-surface-500 dark:text-surface-400">Export format</span>
                <span className="font-semibold text-surface-700 dark:text-surface-200">CSV</span>
              </div>
              <div className="flex items-center justify-between text-xs mt-1.5">
                <span className="text-surface-500 dark:text-surface-400">Active filters</span>
                <span className="font-semibold text-surface-700 dark:text-surface-200">
                  {Object.values(filters).filter((v) => v !== '').length || 'None'}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 sm:px-6 py-3.5 border-t border-surface-200 dark:border-white/[0.06] flex items-center justify-end gap-3 flex-shrink-0 bg-surface-50/50 dark:bg-dark-300/30">
            <button onClick={onClose} className="btn-secondary text-xs sm:text-sm py-2 sm:py-2.5">
              Cancel
            </button>
            <button
              onClick={handleExport}
              disabled={selected.size === 0 || isExporting}
              className="btn-primary text-xs sm:text-sm py-2 sm:py-2.5"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileDown className="w-4 h-4" />
                  Generate CSV
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
