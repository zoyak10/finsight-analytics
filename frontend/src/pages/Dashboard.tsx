import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TrendingUp, TrendingDown, Wallet, Clock } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { KpiCard } from '../components/dashboard/KpiCard';
import { RevenueTrendChart } from '../components/dashboard/RevenueTrendChart';
import { CategoryBreakdown } from '../components/dashboard/CategoryBreakdown';
import { StatusDistribution } from '../components/dashboard/StatusDistribution';
import { InsightPanel } from '../components/dashboard/InsightPanel';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { useAuth } from '../hooks/useAuth';
import { getSummary, getTrends, getCategories } from '../services/api/dashboard';
import { formatCurrency } from '../utils/currency';
import { formatNumber } from '../utils/currency';

export function DashboardPage() {
  const { user } = useAuth();
  const [lastUpdated] = useState(new Date());

  const summaryQuery = useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: () => getSummary(),
    staleTime: 30000,
  });

  const trendsQuery = useQuery({
    queryKey: ['dashboard', 'trends'],
    queryFn: () => getTrends(),
    staleTime: 30000,
  });

  const categoriesQuery = useQuery({
    queryKey: ['dashboard', 'categories'],
    queryFn: () => getCategories(),
    staleTime: 30000,
  });

  const summary = summaryQuery.data;

  // Greeting based on time of day
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="animate-fade-in">
      <Header
        title={`${greeting}, ${user?.name?.split(' ')[0] || 'Analyst'}`}
        subtitle="Here's what's happening across your transactions."
        lastUpdated={lastUpdated}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {summaryQuery.isLoading ? (
          <LoadingSkeleton variant="card" count={4} />
        ) : summary ? (
          <>
            <KpiCard
              title="Total Revenue"
              value={formatCurrency(summary.totalRevenue)}
              subtitle={`${formatNumber(summary.totalTransactions)} total transactions`}
              icon={TrendingUp}
              iconColor="text-emerald-600 dark:text-neon-emerald"
              iconBg="bg-emerald-50 dark:bg-emerald-500/15"
              index={0}
            />
            <KpiCard
              title="Total Expenses"
              value={formatCurrency(summary.totalExpenses)}
              icon={TrendingDown}
              iconColor="text-red-600 dark:text-neon-rose"
              iconBg="bg-red-50 dark:bg-rose-500/15"
              index={1}
            />
            <KpiCard
              title="Net Cash Flow"
              value={formatCurrency(summary.netCashFlow)}
              subtitle={summary.netCashFlow >= 0 ? 'Positive balance' : 'Negative balance'}
              icon={Wallet}
              iconColor="text-brand-600 dark:text-neon-violet"
              iconBg="bg-brand-50 dark:bg-brand-500/15"
              index={2}
              trend={summary.netCashFlow >= 0 ? {
                value: `${((summary.totalRevenue / (summary.totalRevenue + summary.totalExpenses)) * 100).toFixed(1)}% revenue ratio`,
                isPositive: true,
              } : undefined}
            />
            <KpiCard
              title="Pending Transactions"
              value={String(summary.pendingCount)}
              subtitle={`${formatCurrency(summary.pendingAmount)} outstanding`}
              icon={Clock}
              iconColor="text-amber-600 dark:text-neon-amber"
              iconBg="bg-amber-50 dark:bg-amber-500/15"
              index={3}
            />
          </>
        ) : null}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2">
          {trendsQuery.isLoading ? (
            <LoadingSkeleton variant="chart" />
          ) : trendsQuery.data ? (
            <RevenueTrendChart data={trendsQuery.data} />
          ) : null}
        </div>
        <div>
          {categoriesQuery.isLoading ? (
            <LoadingSkeleton variant="chart" />
          ) : categoriesQuery.data ? (
            <CategoryBreakdown data={categoriesQuery.data} />
          ) : null}
        </div>
      </div>

      {/* Status + Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div>
          {summary && <StatusDistribution summary={summary} />}
        </div>
        <div className="lg:col-span-2">
          {summary && trendsQuery.data && categoriesQuery.data && (
            <InsightPanel
              summary={summary}
              trends={trendsQuery.data}
              categories={categoriesQuery.data}
            />
          )}
        </div>
      </div>
    </div>
  );
}
