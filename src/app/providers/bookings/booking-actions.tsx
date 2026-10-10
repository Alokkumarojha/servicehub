'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { toast } from '@/components/ui/toast';

type BookingActionsProps = {
  bookingId: string;
  status: 'PENDING' | 'ACCEPTED';
};

export function BookingActions({ bookingId, status }: BookingActionsProps) {
  const router = useRouter();
  const inFlight = useRef(false);
  const [failure, setFailure] = useState('');

  const [loadingAction, setLoadingAction] = useState<
    'ACCEPT' | 'REJECT' | 'COMPLETE' | null
  >(null);

  async function handleAction(action: 'ACCEPT' | 'REJECT' | 'COMPLETE') {
    if (inFlight.current) return;
    inFlight.current = true;
    setFailure('');
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
        setFailure(response.status === 409
          ? 'This job has changed or is no longer available to update. Refresh Jobs before trying again.'
          : 'The update could not be confirmed. Refresh Jobs before trying again.');
        return;
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
        type: 'success',
        title: 'Success',
        description: successMessage,
      });

      router.refresh();
    } catch (error) {
      console.error('Booking action error:', error);

      setFailure('The update could not be confirmed. Check your connection and refresh Jobs before trying again.');
    } finally {
      setLoadingAction(null);
      inFlight.current = false;
    }
  }

  return (
    <div aria-busy={loadingAction !== null} className="mt-5 flex flex-wrap gap-3 border-t pt-4">
      {failure && <p role="alert" className="w-full text-sm text-destructive">{failure}</p>}
      <p role="status" className="sr-only">{loadingAction ? 'Updating job. Please wait.' : ''}</p>
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
