interface LoadingSkeletonProps {
  variant?: 'card' | 'chart' | 'row' | 'text';
  count?: number;
}

function SkeletonPulse({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-surface-200 rounded ${className || ''}`} />;
}

export function LoadingSkeleton({ variant = 'card', count = 1 }: LoadingSkeletonProps) {
  const items = Array.from({ length: count }, (_, i) => i);

  if (variant === 'card') {
    return (
      <>
        {items.map((i) => (
          <div key={i} className="card p-6 space-y-4">
            <div className="flex items-center gap-3">
              <SkeletonPulse className="w-10 h-10 rounded-lg" />
              <SkeletonPulse className="h-4 w-20" />
            </div>
            <SkeletonPulse className="h-8 w-32" />
            <SkeletonPulse className="h-3 w-24" />
          </div>
        ))}
      </>
    );
  }

  if (variant === 'chart') {
    return (
      <div className="card p-6 space-y-4">
        <SkeletonPulse className="h-5 w-40" />
        <SkeletonPulse className="h-64 w-full rounded-lg" />
      </div>
    );
  }

  if (variant === 'row') {
    return (
      <>
        {items.map((i) => (
          <tr key={i}>
            {Array.from({ length: 7 }, (_, j) => (
              <td key={j} className="px-4 py-3">
                <SkeletonPulse className="h-4 w-full" />
              </td>
            ))}
          </tr>
        ))}
      </>
    );
  }

  return (
    <>
      {items.map((i) => (
        <SkeletonPulse key={i} className="h-4 w-full" />
      ))}
    </>
  );
}
