import { AlertCircle, CheckCircle2, Clock, XCircle } from 'lucide-react';

const statuses = {
  PENDING: { label: 'Pending', icon: Clock, color: 'border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300' },
  ACCEPTED: { label: 'Accepted', icon: AlertCircle, color: 'border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300' },
  COMPLETED: { label: 'Completed', icon: CheckCircle2, color: 'border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-300' },
  CANCELLED: { label: 'Cancelled', icon: XCircle, color: 'border-border bg-muted text-muted-foreground' },
  REJECTED: { label: 'Rejected', icon: XCircle, color: 'border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300' },
};

export function BookingStatusBadge({ status }: { status: string }) {
  const key = status.toUpperCase();
  const style = Object.hasOwn(statuses, key)
    ? statuses[key as keyof typeof statuses]
    : { label: status, icon: AlertCircle, color: 'border-border bg-muted text-muted-foreground' };
  const Icon = style.icon;

  return (
    <span className={`inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${style.color}`}>
      <Icon className="size-3.5 shrink-0" aria-hidden="true" />
      {style.label}
    </span>
  );
}
