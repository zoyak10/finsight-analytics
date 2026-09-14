import { RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getRelativeTime } from '../../utils/date';

interface HeaderProps {
  title: string;
  subtitle?: string;
  lastUpdated?: Date;
  children?: React.ReactNode;
}

export function Header({ title, subtitle, lastUpdated, children }: HeaderProps) {
  const [timeLabel, setTimeLabel] = useState('');

  useEffect(() => {
    if (!lastUpdated) return;
    setTimeLabel(getRelativeTime(lastUpdated));
    const interval = setInterval(() => {
      setTimeLabel(getRelativeTime(lastUpdated));
    }, 10000);
    return () => clearInterval(interval);
  }, [lastUpdated]);

  return (
    <header className="mb-4 sm:mb-6 lg:mb-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-surface-900 dark:text-white">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs sm:text-sm text-surface-500 dark:text-surface-400 mt-0.5 sm:mt-1">{subtitle}</p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {lastUpdated && (
            <span className="flex items-center gap-1.5 text-xs text-surface-400 dark:text-surface-500">
              <RefreshCw className="w-3 h-3" />
              Updated {timeLabel}
            </span>
          )}
          {children}
        </div>
      </div>
    </header>
  );
}
