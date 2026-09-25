import React from 'react';

export type BadgeVariant =
  | 'CAPTURED'
  | 'BALANCED'
  | 'HEALTHY'
  | 'SETTLED'
  | 'PENDING'
  | 'RETRYING'
  | 'DEGRADED'
  | 'FAILED'
  | 'REFUNDED'
  | 'ACTIVE'
  | 'LIVE';

interface StatusBadgeProps {
  status?: string;
  variant?: string;
  pulse?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  variant,
  pulse = true,
  size = 'md',
  className = ''
}) => {
  const effectiveStatus = (variant || status || 'CAPTURED').toUpperCase();
  const norm = effectiveStatus;

  let colors = 'bg-emerald-500/15 text-emerald-700 border-emerald-500/20';
  let dotColor = 'bg-emerald-500';

  if (norm.includes('CAPTURED') || norm.includes('BALANCED') || norm.includes('HEALTHY') || norm.includes('SETTLED') || norm.includes('ACTIVE') || norm.includes('DELIVERED')) {
    colors = 'bg-emerald-500/15 text-emerald-700 border-emerald-500/20';
    dotColor = 'bg-emerald-500';
  } else if (norm.includes('PENDING') || norm.includes('RETRY') || norm.includes('DEGRADED') || norm.includes('WARNING') || norm.includes('INVESTIGATING')) {
    colors = 'bg-amber-500/15 text-amber-700 border-amber-500/20';
    dotColor = 'bg-amber-500';
  } else if (norm.includes('FAIL') || norm.includes('CRITICAL') || norm.includes('TIMEOUT') || norm.includes('ERROR')) {
    colors = 'bg-rose-500/15 text-rose-700 border-rose-500/20';
    dotColor = 'bg-rose-500';
  } else if (norm.includes('REFUND') || norm.includes('REVERSAL')) {
    colors = 'bg-purple-500/15 text-purple-700 border-purple-500/20';
    dotColor = 'bg-purple-500';
  } else if (norm.includes('INFO') || norm.includes('NODAL') || norm.includes('PAYMENT_CAPTURE')) {
    colors = 'bg-blue-500/15 text-blue-700 border-blue-500/20';
    dotColor = 'bg-blue-500';
  }

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-0.5 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-mono font-semibold tracking-wider uppercase border ${colors} ${sizeClasses} ${className}`}
    >
      {pulse ? (
        <span className="relative flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotColor}`} />
          <span className={`relative inline-flex rounded-full h-2 w-2 ${dotColor}`} />
        </span>
      ) : (
        <span className={`inline-flex rounded-full h-1.5 w-1.5 ${dotColor}`} />
      )}
      <span>{status}</span>
    </span>
  );
};
