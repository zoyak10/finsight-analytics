import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { TrendData } from '../../types';
import { formatCurrency } from '../../utils/currency';
import { useTheme } from '../../hooks/useTheme';

interface RevenueTrendChartProps {
  data: TrendData[];
  isLoading?: boolean;
}

function CustomTooltip({ active, payload, label, isDark }: any) {
  if (!active || !payload) return null;

  return (
    <div className={`px-4 py-3 rounded-xl shadow-xl border backdrop-blur-xl ${
      isDark
        ? 'bg-dark-200/90 border-white/10 shadow-glass-dark'
        : 'bg-white/95 border-surface-200 shadow-glass'
    }`}>
      <p className={`text-xs font-semibold mb-2 ${isDark ? 'text-surface-200' : 'text-surface-700'}`}>{label}</p>
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2 text-xs">
          <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: entry.color }} />
          <span className={isDark ? 'text-surface-400' : 'text-surface-500'}>{entry.name}:</span>
          <span className={`font-semibold ${isDark ? 'text-surface-100' : 'text-surface-800'}`}>{formatCurrency(entry.value)}</span>
        </div>
      ))}
    </div>
  );
}

export function RevenueTrendChart({ data }: RevenueTrendChartProps) {
  const { isDark } = useTheme();

  const revenueColor = isDark ? '#22d3ee' : '#6366f1';
  const expenseColor = isDark ? '#fb7185' : '#f43f5e';
  const gridColor = isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0';
  const textColor = isDark ? '#64748b' : '#94a3b8';

  return (
    <div className="card p-4 sm:p-5 animate-fade-in">
      <h3 className="text-base font-semibold text-surface-800 dark:text-surface-100 mb-4">Revenue vs Expenses</h3>
      <div className="h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={revenueColor} stopOpacity={0.2} />
                <stop offset="95%" stopColor={revenueColor} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={expenseColor} stopOpacity={0.2} />
                <stop offset="95%" stopColor={expenseColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: textColor }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: textColor }}
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
              dx={-2}
            />
            <Tooltip content={<CustomTooltip isDark={isDark} />} />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 11, paddingBottom: 8, color: textColor }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              name="Revenue"
              stroke={revenueColor}
              strokeWidth={2.5}
              fill="url(#gradRevenue)"
              dot={false}
              activeDot={{ r: 5, strokeWidth: 2, fill: isDark ? '#111827' : '#fff', stroke: revenueColor }}
            />
            <Area
              type="monotone"
              dataKey="expenses"
              name="Expenses"
              stroke={expenseColor}
              strokeWidth={2.5}
              fill="url(#gradExpenses)"
              dot={false}
              activeDot={{ r: 5, strokeWidth: 2, fill: isDark ? '#111827' : '#fff', stroke: expenseColor }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
