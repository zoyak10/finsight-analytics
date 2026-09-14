import { TrendingUp, TrendingDown, Clock, PieChart, Activity, CalendarDays } from 'lucide-react';
import type { DashboardSummary, TrendData, CategoryData } from '../../types';
import { formatCurrency } from '../../utils/currency';

interface InsightPanelProps {
  summary: DashboardSummary;
  trends: TrendData[];
  categories: CategoryData[];
}

interface Insight {
  icon: React.ReactNode;
  text: string;
  color: string;
  darkColor: string;
}

function generateInsights(summary: DashboardSummary, trends: TrendData[], categories: CategoryData[]): Insight[] {
  const insights: Insight[] = [];
  const total = summary.totalRevenue + summary.totalExpenses;

  // Revenue percentage
  if (total > 0) {
    const revPct = ((summary.totalRevenue / total) * 100).toFixed(1);
    insights.push({
      icon: <TrendingUp className="w-4 h-4" />,
      text: `Revenue accounts for ${revPct}% of total transaction volume.`,
      color: 'text-emerald-600 bg-emerald-50',
      darkColor: 'dark:text-neon-emerald dark:bg-emerald-500/10',
    });
  }

  // Pending outstanding
  if (summary.pendingCount > 0) {
    insights.push({
      icon: <Clock className="w-4 h-4" />,
      text: `${summary.pendingCount} pending transactions represent ${formatCurrency(summary.pendingAmount)} in outstanding value.`,
      color: 'text-amber-600 bg-amber-50',
      darkColor: 'dark:text-neon-amber dark:bg-amber-500/10',
    });
  }

  // Highest activity month
  if (trends.length > 0) {
    const highestMonth = trends.reduce((max, t) =>
      (t.revenue + t.expenses) > (max.revenue + max.expenses) ? t : max
    );
    insights.push({
      icon: <CalendarDays className="w-4 h-4" />,
      text: `Highest transaction activity occurred in ${highestMonth.month}.`,
      color: 'text-brand-600 bg-brand-50',
      darkColor: 'dark:text-neon-violet dark:bg-brand-500/10',
    });
  }

  // Net cash flow
  if (summary.netCashFlow > 0) {
    insights.push({
      icon: <TrendingUp className="w-4 h-4" />,
      text: `Net cash flow is positive at ${formatCurrency(summary.netCashFlow)}.`,
      color: 'text-emerald-600 bg-emerald-50',
      darkColor: 'dark:text-neon-emerald dark:bg-emerald-500/10',
    });
  } else if (summary.netCashFlow < 0) {
    insights.push({
      icon: <TrendingDown className="w-4 h-4" />,
      text: `Net cash flow is negative at ${formatCurrency(summary.netCashFlow)}.`,
      color: 'text-red-600 bg-red-50',
      darkColor: 'dark:text-neon-rose dark:bg-rose-500/10',
    });
  }

  // Largest category
  if (categories.length > 0) {
    const largest = categories.reduce((max, c) =>
      c.totalAmount > max.totalAmount ? c : max
    );
    insights.push({
      icon: <PieChart className="w-4 h-4" />,
      text: `The largest category by transaction value is ${largest.category} at ${formatCurrency(largest.totalAmount)}.`,
      color: 'text-brand-600 bg-brand-50',
      darkColor: 'dark:text-neon-cyan dark:bg-cyan-500/10',
    });
  }

  // Average transaction
  if (summary.avgTransactionAmount > 0) {
    insights.push({
      icon: <Activity className="w-4 h-4" />,
      text: `Average transaction amount is ${formatCurrency(summary.avgTransactionAmount)} across ${summary.totalTransactions} transactions.`,
      color: 'text-surface-600 bg-surface-50',
      darkColor: 'dark:text-surface-300 dark:bg-dark-50/30',
    });
  }

  return insights;
}

export function InsightPanel({ summary, trends, categories }: InsightPanelProps) {
  const insights = generateInsights(summary, trends, categories);

  if (insights.length === 0) return null;

  return (
    <div className="card p-5 animate-fade-in">
      <h3 className="text-base font-semibold text-surface-800 dark:text-surface-100 mb-4">Financial Insights</h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {insights.map((insight, i) => (
          <div
            key={i}
            className="flex items-start gap-3 p-3 rounded-xl bg-surface-50/50 dark:bg-dark-200/40 border border-surface-100 dark:border-white/[0.06] hover:border-surface-200 dark:hover:border-white/[0.1] transition-all duration-200 group"
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${insight.color} ${insight.darkColor}`}>
              {insight.icon}
            </div>
            <p className="text-sm text-surface-700 dark:text-surface-300 leading-relaxed">{insight.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
