import { useState, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { FileDown } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { SearchBar } from '../components/transactions/SearchBar';
import { FilterPanel } from '../components/transactions/FilterPanel';
import { FilterChips } from '../components/ui/FilterChips';
import { TransactionTable } from '../components/transactions/TransactionTable';
import { Pagination } from '../components/transactions/Pagination';
import { ExportReportModal } from '../components/reports/ExportReportModal';
import { getTransactions, getUsers } from '../services/api/transactions';
import { useDebounce } from '../hooks/useDebounce';

const DEFAULT_FILTERS = {
  search: '',
  startDate: '',
  endDate: '',
  minAmount: '',
  maxAmount: '',
  category: '',
  status: '',
  userId: '',
};

export function TransactionsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize state from URL params
  const [filters, setFilters] = useState(() => ({
    search: searchParams.get('search') || '',
    startDate: searchParams.get('startDate') || '',
    endDate: searchParams.get('endDate') || '',
    minAmount: searchParams.get('minAmount') || '',
    maxAmount: searchParams.get('maxAmount') || '',
    category: searchParams.get('category') || '',
    status: searchParams.get('status') || '',
    userId: searchParams.get('userId') || '',
  }));

  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>((searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [limit, setLimit] = useState(Number(searchParams.get('limit')) || 20);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [lastUpdated] = useState(new Date());

  const debouncedSearch = useDebounce(filters.search, 300);

  // Sync URL params
  const updateUrl = useCallback((updates: Record<string, string | number>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([k, v]) => {
      if (v === '' || v === undefined || v === null) {
        params.delete(k);
      } else {
        params.set(k, String(v));
      }
    });
    setSearchParams(params, { replace: true });
  }, [searchParams, setSearchParams]);

  // Query params
  const queryParams = useMemo(() => ({
    page,
    limit,
    sortBy,
    sortOrder,
    search: debouncedSearch,
    startDate: filters.startDate,
    endDate: filters.endDate,
    minAmount: filters.minAmount,
    maxAmount: filters.maxAmount,
    category: filters.category,
    status: filters.status,
    userId: filters.userId,
  }), [page, limit, sortBy, sortOrder, debouncedSearch, filters]);

  const { data, isLoading } = useQuery({
    queryKey: ['transactions', queryParams],
    queryFn: () => getTransactions(queryParams),
    staleTime: 15000,
  });

  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
    staleTime: 60000,
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
    updateUrl({ [key]: value, page: 1 });
  };

  const handleSearch = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
    setPage(1);
    updateUrl({ search: value, page: 1 });
  };

  const handleSort = (field: string) => {
    const newOrder = field === sortBy && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortBy(field);
    setSortOrder(newOrder);
    updateUrl({ sortBy: field, sortOrder: newOrder });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    updateUrl({ page: newPage });
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
    updateUrl({ limit: newLimit, page: 1 });
  };

  const handleClearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
    setSearchParams({});
  };

  // Active filter chips
  const activeFilterChips = useMemo(() => {
    const chips: { key: string; label: string; value: string }[] = [];
    if (filters.category) chips.push({ key: 'category', label: 'Category', value: filters.category });
    if (filters.status) chips.push({ key: 'status', label: 'Status', value: filters.status });
    if (filters.userId) chips.push({ key: 'userId', label: 'User', value: filters.userId });
    if (filters.startDate) chips.push({ key: 'startDate', label: 'From', value: filters.startDate });
    if (filters.endDate) chips.push({ key: 'endDate', label: 'To', value: filters.endDate });
    if (filters.minAmount) chips.push({ key: 'minAmount', label: 'Min ₹', value: filters.minAmount });
    if (filters.maxAmount) chips.push({ key: 'maxAmount', label: 'Max ₹', value: filters.maxAmount });
    return chips;
  }, [filters]);

  const transactions = data?.data || [];
  const pagination = data?.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 };

  return (
    <div className="animate-fade-in">
      <Header
        title="Transactions"
        subtitle={`${pagination.total} total records`}
        lastUpdated={lastUpdated}
      >
        <button onClick={() => setExportModalOpen(true)} className="btn-primary">
          <FileDown className="w-4 h-4" />
          Generate Report
        </button>
      </Header>

      {/* Toolbar */}
      <div className="card mb-4">
        <div className="p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
          <div className="flex-1 sm:flex-none sm:w-72">
            <SearchBar value={filters.search} onChange={handleSearch} />
          </div>
          <div className="hidden sm:block flex-1" />
          <FilterPanel
            filters={filters}
            users={usersQuery.data || []}
            onChange={handleFilterChange}
            onClear={handleClearFilters}
          />
        </div>

        {activeFilterChips.length > 0 && (
          <div className="px-4 pb-3">
            <FilterChips
              filters={activeFilterChips}
              onRemove={(key) => handleFilterChange(key, '')}
              onClearAll={handleClearFilters}
            />
          </div>
        )}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <TransactionTable
          data={transactions}
          isLoading={isLoading}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          onClearFilters={handleClearFilters}
        />

        {pagination.total > 0 && (
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            total={pagination.total}
            limit={pagination.limit}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
          />
        )}
      </div>

      {/* Export Modal */}
      <ExportReportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        filters={filters}
        recordCount={pagination.total}
      />
    </div>
  );
}
