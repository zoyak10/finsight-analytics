import { describe, it, expect } from 'vitest';
import { buildTransactionFilter } from './queryBuilder';

describe('buildTransactionFilter', () => {
  it('should return empty filter when no parameters are provided', () => {
    const filter = buildTransactionFilter({});
    expect(filter).toEqual({});
  });

  it('should build date range query properly', () => {
    const filter = buildTransactionFilter({
      startDate: '2024-01-01',
      endDate: '2024-01-31',
    });

    expect(filter.date).toBeDefined();
    expect(filter.date.$gte).toBeInstanceOf(Date);
    expect(filter.date.$lte).toBeInstanceOf(Date);
  });

  it('should build amount range query properly', () => {
    const filter = buildTransactionFilter({
      minAmount: 100,
      maxAmount: 500,
    });

    expect(filter.amount).toEqual({ $gte: 100, $lte: 500 });
  });

  it('should filter by category and status', () => {
    const filter = buildTransactionFilter({
      category: 'Software',
      status: 'Paid',
    });

    expect(filter.category).toBe('Software');
    expect(filter.status).toBe('Paid');
  });

  it('should build multi-field regex search conditions', () => {
    const filter = buildTransactionFilter({ search: 'marketing' });
    expect(filter.$or).toBeDefined();
    expect(filter.$or?.length).toBeGreaterThanOrEqual(3);
  });

  it('should include numeric id search when search term is numeric', () => {
    const filter = buildTransactionFilter({ search: '104' });
    expect(filter.$or).toBeDefined();
    const hasIdCondition = filter.$or?.some((cond) => (cond as any).id === 104);
    expect(hasIdCondition).toBe(true);
  });
});
