'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/toast';

type ReviewBookingButtonProps = {
  bookingId: string;
};

export function ReviewBookingButton({ bookingId }: ReviewBookingButtonProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    if (rating < 1 || rating > 5) {
      toast.add({
        title: 'Rating required',
        description: 'Please select a rating from 1 to 5 stars.',
      });

      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId,
          rating,
          comment,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit review');
      }

      toast.add({
        title: 'Review submitted',
        description: 'Thank you for sharing your feedback.',
      });

      setOpen(false);
      setRating(0);
      setComment('');

      router.refresh();
    } catch (error) {
      console.error('Submit review error:', error);

      toast.add({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to submit review.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" />}>
        Write Review
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rate your service</DialogTitle>

          <DialogDescription>
            Share your experience with this service provider.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div>
            <p className="mb-2 text-sm font-medium">Rating</p>

            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  className="rounded-md p-1 transition hover:scale-110"
                  aria-label={`Rate ${value} star${value > 1 ? 's' : ''}`}
                >
                  <Star
                    className="size-7"
                    fill={value <= rating ? 'currentColor' : 'none'}
                  />
                </button>
              ))}
            </div>

            {rating > 0 && (
              <p className="mt-2 text-sm text-muted-foreground">
                {rating} out of 5 stars
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor={`review-comment-${bookingId}`}
              className="text-sm font-medium"
            >
              Comment
            </label>

            <Textarea
              id={`review-comment-${bookingId}`}
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Tell us about your experience..."
              rows={4}
              maxLength={500}
            />

            <p className="text-right text-xs text-muted-foreground">
              {comment.length}/500
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || rating === 0}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
