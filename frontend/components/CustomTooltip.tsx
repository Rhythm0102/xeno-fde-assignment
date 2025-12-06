'use client';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    color?: string;
  }>;
  label?: string;
}

export const CustomTooltip = ({
  active,
  payload,
  label,
}: CustomTooltipProps) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div
      style={{
        backgroundColor: 'var(--card)',
        border: '1px solid var(--primary)',
        borderRadius: '0.5rem',
        padding: '0.75rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      }}
    >
      <p
        style={{
          color: 'var(--foreground)',
          margin: '0 0 0.5rem 0',
          fontSize: '0.875rem',
          fontWeight: 500,
        }}
      >
        {label}
      </p>
      {payload.map((entry, index) => (
        <p
          key={index}
          style={{
            color: entry.color || 'var(--foreground)',
            margin: '0.25rem 0',
            fontSize: '0.875rem',
          }}
        >
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
};
