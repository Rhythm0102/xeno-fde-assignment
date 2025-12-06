'use client';

import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: number;
  trendLabel?: string;
}

export const StatCard = ({ title, value, icon, trend, trendLabel }: StatCardProps) => {
  const isTrendPositive = trend && trend >= 0;

  return (
    <div className="p-6 rounded-lg border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--card-hover)] shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-[var(--text-secondary)] mb-1">
            {title}
          </p>
          <p className="text-3xl font-bold text-[var(--text-primary)]">
            {value}
          </p>
          {trend !== undefined && (
            <p className={`text-sm font-medium mt-2 ${
              isTrendPositive ? 'text-[var(--success)]' : 'text-[var(--danger)]'
            }`}>
              {isTrendPositive ? '↑' : '↓'} {Math.abs(trend)}% {trendLabel || 'from last month'}
            </p>
          )}
        </div>
        <div className="flex-shrink-0 ml-4">
          {icon}
        </div>
      </div>
    </div>
  );
};
