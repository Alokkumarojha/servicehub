'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type BookingActionsProps = {
  bookingId: string;
};

export function BookingActions({ bookingId }: BookingActionsProps) {
  const router = useRouter();

  const [loadingAction, setLoadingAction] = useState<
    'ACCEPT' | 'REJECT' | null
  >(null);

  async function handleAction(action: 'ACCEPT' | 'REJECT') {
    setLoadingAction(action);

    try {
      const response = await fetch(`/api/provider/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
        }),
      });

      if (!response.ok) {
        const data = await response.json();

        throw new Error(data.error || 'Failed to update booking');
      }

      router.refresh();
    } catch (error) {
      console.error(error);

      alert('Unable to update booking. Please try again.');
    } finally {
      setLoadingAction(null);
    }
  }

  return (
    <div className="mt-5 flex flex-wrap gap-3 border-t pt-4">
      <button
        type="button"
        onClick={() => handleAction('ACCEPT')}
        disabled={loadingAction !== null}
        className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loadingAction === 'ACCEPT' ? 'Accepting...' : 'Accept'}
      </button>

      <button
        type="button"
        onClick={() => handleAction('REJECT')}
        disabled={loadingAction !== null}
        className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loadingAction === 'REJECT' ? 'Rejecting...' : 'Reject'}
      </button>
    </div>
  );
}
