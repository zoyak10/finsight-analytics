import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  index?: number;
}

export function KpiCard({ title, value, subtitle, icon: Icon, iconColor, iconBg, trend, index = 0 }: KpiCardProps) {
  return (
    <div
      className={`card-hover p-5 neon-border group animate-fade-in stagger-${index + 1}`}
      style={{ animationFillMode: 'backwards' }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-surface-500 dark:text-surface-400">{title}</p>
          <p className="text-2xl font-bold text-surface-900 dark:text-white mt-1.5 truncate">{value}</p>
          {subtitle && (
            <p className="text-xs text-surface-400 dark:text-surface-500 mt-1">{subtitle}</p>
          )}
          {trend && (
            <p className={`text-xs font-semibold mt-1.5 flex items-center gap-1 ${
              trend.isPositive
                ? 'text-emerald-600 dark:text-neon-emerald'
                : 'text-red-600 dark:text-neon-rose'
            }`}>
              <span className={`inline-block w-4 h-4 rounded-full text-[10px] flex items-center justify-center ${
                trend.isPositive
                  ? 'bg-emerald-100 dark:bg-emerald-500/15'
                  : 'bg-red-100 dark:bg-red-500/15'
              }`}>
                {trend.isPositive ? '↑' : '↓'}
              </span>
              {trend.value}
            </p>
          )}
        </div>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg ${iconBg} dark:bg-opacity-15`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
      </div>
      {/* Bottom accent bar */}
      <div className="mt-4 h-0.5 w-full bg-surface-100 dark:bg-dark-50/30 rounded-full overflow-hidden">
        <div className="h-full w-2/3 bg-gradient-to-r from-brand-500 to-neon-cyan rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </div>
  );
}
