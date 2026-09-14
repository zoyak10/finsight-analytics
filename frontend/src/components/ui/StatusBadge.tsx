interface StatusBadgeProps {
  status: 'Paid' | 'Pending';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={status === 'Paid' ? 'badge-success' : 'badge-warning'}>
      <span
        className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${
          status === 'Paid'
            ? 'bg-emerald-500 dark:bg-neon-emerald'
            : 'bg-amber-500 dark:bg-neon-amber'
        }`}
      />
      {status}
    </span>
  );
}
