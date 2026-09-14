import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { CategoryData } from '../../types';
import { formatCurrency } from '../../utils/currency';
import { useTheme } from '../../hooks/useTheme';

interface CategoryBreakdownProps {
  data: CategoryData[];
}

const COLORS_LIGHT: Record<string, string> = {
  Revenue: '#6366f1',
  Expense: '#f43f5e',
};

const COLORS_DARK: Record<string, string> = {
  Revenue: '#22d3ee',
  Expense: '#fb7185',
};

function CustomTooltip({ active, payload, isDark }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className={`px-4 py-3 rounded-xl shadow-xl border backdrop-blur-xl ${
      isDark
        ? 'bg-dark-200/90 border-white/10'
        : 'bg-white/95 border-surface-200'
    }`}>
      <p className={`text-xs font-semibold ${isDark ? 'text-surface-200' : 'text-surface-700'}`}>{d.category}</p>
      <p className={`text-sm font-bold mt-1 ${isDark ? 'text-white' : 'text-surface-900'}`}>{formatCurrency(d.totalAmount)}</p>
      <p className={`text-xs ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>{d.count} transactions</p>
    </div>
  );
}

export function CategoryBreakdown({ data }: CategoryBreakdownProps) {
  const { isDark } = useTheme();
  const COLORS = isDark ? COLORS_DARK : COLORS_LIGHT;
  const total = data.reduce((sum, d) => sum + d.totalAmount, 0);

  return (
    <div className="card p-4 sm:p-5 animate-fade-in">
      <h3 className="text-base font-semibold text-surface-800 dark:text-surface-100 mb-4">Category Breakdown</h3>
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="w-40 h-40 sm:w-44 sm:h-44 relative flex-shrink-0 mx-auto sm:mx-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={48}
                outerRadius={68}
                paddingAngle={3}
                dataKey="totalAmount"
                nameKey="category"
                strokeWidth={0}
              >
                {data.map((entry) => (
                  <Cell key={entry.category} fill={COLORS[entry.category] || '#94a3b8'} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip isDark={isDark} />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] text-surface-400 dark:text-surface-500 font-medium">Total Volume</span>
            <span className="text-xs sm:text-sm font-bold text-surface-800 dark:text-white">{formatCurrency(total)}</span>
          </div>
        </div>
        <div className="w-full sm:flex-1 space-y-3">
          {data.map((item) => {
            const pct = total > 0 ? ((item.totalAmount / total) * 100).toFixed(1) : '0';
            return (
              <div key={item.category} className="w-full">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shadow-sm flex-shrink-0"
                      style={{ backgroundColor: COLORS[item.category] }}
                    />
                    <span className="text-sm font-medium text-surface-700 dark:text-surface-300">{item.category}</span>
                  </div>
                  <span className="text-sm font-semibold text-surface-800 dark:text-surface-100">{pct}%</span>
                </div>
                <div className="w-full h-1.5 bg-surface-100 dark:bg-dark-50/30 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: COLORS[item.category],
                      boxShadow: isDark ? `0 0 8px ${COLORS[item.category]}40` : 'none',
                    }}
                  />
                </div>
                <p className="text-xs text-surface-400 dark:text-surface-500 mt-0.5">
                  {formatCurrency(item.totalAmount)} · {item.count} txns
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
