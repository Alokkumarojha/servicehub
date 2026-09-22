'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { toast } from '@/components/ui/toast';

type BookingActionsProps = {
  bookingId: string;
  status: 'PENDING' | 'ACCEPTED';
};

export function BookingActions({ bookingId, status }: BookingActionsProps) {
  const router = useRouter();

  const [loadingAction, setLoadingAction] = useState<
    'ACCEPT' | 'REJECT' | 'COMPLETE' | null
  >(null);

  async function handleAction(action: 'ACCEPT' | 'REJECT' | 'COMPLETE') {
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

      let successMessage = 'Booking updated successfully.';

      if (action === 'ACCEPT') {
        successMessage = 'Booking accepted successfully.';
      } else if (action === 'REJECT') {
        successMessage = 'Booking rejected successfully.';
      } else if (action === 'COMPLETE') {
        successMessage = 'Booking marked as completed successfully.';
      }

      toast.add({
        title: 'Success',
        description: successMessage,
      });

      router.refresh();
    } catch (error) {
      console.error('Booking action error:', error);

      toast.add({
        title: 'Error',
        description: 'Failed to update booking.',
      });
    } finally {
      setLoadingAction(null);
    }
  }

  return (
    <div className="mt-5 flex flex-wrap gap-3 border-t pt-4">
      {status === 'PENDING' && (
        <>
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
        </>
      )}

      {status === 'ACCEPTED' && (
        <button
          type="button"
          onClick={() => handleAction('COMPLETE')}
          disabled={loadingAction !== null}
          className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loadingAction === 'COMPLETE'
            ? 'Marking as Completed...'
            : 'Mark as Completed'}
        </button>
      )}
    </div>
  );
}
