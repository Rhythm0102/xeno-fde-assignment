'use client';

import { ReactNode } from 'react';

interface SectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
}

export const Section = ({ title, description, children, actions }: SectionProps) => {
  return (
    <div className="p-6 rounded-lg border border-[var(--border)] bg-[var(--card)] shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex-shrink-0 ml-4">
            {actions}
          </div>
        )}
      </div>
      <div className="border-t border-[var(--border)] pt-4">
        {children}
      </div>
    </div>
  );
};
