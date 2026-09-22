'use client';

import { useState } from 'react';
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

type CancelBookingButtonProps = {
  bookingId: string;
};

export function CancelBookingButton({ bookingId }: CancelBookingButtonProps) {
  const [isCancelling, setIsCancelling] = useState(false);

  const router = useRouter();

  async function handleCancel() {
    setIsCancelling(true);

    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        const data = await response.json();

        throw new Error(data.error || 'Failed to cancel booking');
      }

      router.refresh();
    } catch (error) {
      console.error('Cancel booking error:', error);

      alert('Unable to cancel booking. Please try again.');
    } finally {
      setIsCancelling(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" />}>
        Cancel Booking
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel Booking?</DialogTitle>

          <DialogDescription>
            Are you sure you want to cancel this booking?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
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
