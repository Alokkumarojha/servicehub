'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';

type CancelBookingButtonProps = {
  bookingId: string;
};

export function CancelBookingButton({ bookingId }: CancelBookingButtonProps) {
  const [isCancelling, setIsCancelling] = useState(false);
  const [open, setOpen] = useState(false);
  const [failure, setFailure] = useState('');
  const inFlight = useRef(false);

  const router = useRouter();

  async function handleCancel() {
    if (inFlight.current) return;
    inFlight.current = true;
    setFailure('');
    setIsCancelling(true);

    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        setFailure(response.status === 409
          ? 'This booking could not be cancelled. Refresh My Bookings to check its current status.'
          : 'Cancellation could not be confirmed. Check My Bookings before trying again.');
        return;
      }

      toast.add({ title: 'Booking cancelled', type: 'success' });
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error('Cancel booking error:', error);

      setFailure('Cancellation could not be confirmed. Check your connection and My Bookings before trying again.');
    } finally {
      setIsCancelling(false);
      inFlight.current = false;
    }
  }

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => { if (!inFlight.current) { setOpen(nextOpen); setFailure(''); } }}>
      <DialogTrigger render={<Button variant="outline" />}>
        Cancel Booking
      </DialogTrigger>

      <DialogContent aria-busy={isCancelling} showCloseButton={!isCancelling}>
        <DialogHeader>
          <DialogTitle>Cancel Booking?</DialogTitle>

          <DialogDescription>
            Are you sure you want to cancel this booking?
          </DialogDescription>
        </DialogHeader>

        {failure && <p role="alert" className="text-sm text-destructive">{failure}</p>}
        <p role="status" className="sr-only">{isCancelling ? 'Cancelling booking. Please wait.' : ''}</p>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" disabled={isCancelling} />}>
            Keep Booking
          </DialogClose>

          <Button
            variant="destructive"
            onClick={handleCancel}
            disabled={isCancelling}
          >
            {isCancelling ? 'Cancelling...' : 'Cancel Booking'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
