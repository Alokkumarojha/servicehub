import Link from 'next/link';
import { redirect } from 'next/navigation';

import { CancelBookingButton } from './cancel-booking-button';
import { ReviewBookingButton } from './review-booking-button';

import {
  Calendar,
  MapPin,
  User,
  IndianRupee,
  CheckCircle2,
  CalendarX2,
  ArrowRight,
} from 'lucide-react';

import { BookingStatusBadge } from '@/components/booking-status-badge';
import { buttonVariants } from '@/components/ui/button';
import { getCurrentUser } from '@/lib/auth-user';
import { prisma } from '@/lib/prisma';

// Date formatting helper function
function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date));
}

export default async function MyBookingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/sign-in?redirect_url=/my-bookings');
  }

  // Fetch customer bookings
  const bookings = await prisma.booking.findMany({
    where: {
      customerId: user.id,
    },
    include: {
      service: true,
      provider: {
        include: {
          user: true,
        },
      },
      address: true,

      // Load review so we know whether
      // this booking has already been reviewed
      review: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <main className="min-h-screen bg-background pb-16">
      {/* Header Section */}
      <section className="border-b bg-card/40 py-8 sm:py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold tracking-tight">
            My Bookings
          </h1>

          <p className="mt-1.5 text-sm text-muted-foreground">
            Track and manage your requested service bookings.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-5xl px-4 pt-8 sm:px-6 lg:px-8">
        {bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-card/50 p-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <CalendarX2 className="h-7 w-7" />
            </div>

            <h3 className="mt-4 text-lg font-bold">No bookings found</h3>

            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              You haven&apos;t requested any service bookings yet. Explore our top
              providers to get started.
            </p>

            <Link
              href="/services"
              className={buttonVariants({
                className: 'mt-6 gap-2',
              })}
            >
              <span>Explore Services</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="min-w-0 [overflow-wrap:anywhere] rounded-2xl border bg-card p-5 shadow-sm transition-all hover:shadow-md sm:p-6"
              >
                {/* Header Info & Status */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Service Booking
                    </span>

                    <h2 className="text-xl font-bold text-card-foreground">
                      {booking.service.title}
                    </h2>

                    <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground sm:text-sm">
                      <User className="h-3.5 w-3.5 shrink-0" />

                      <span>
                        Provider:{' '}
                        <strong className="font-semibold text-foreground">
                          {booking.provider.user.name?.trim() || booking.provider.user.email?.trim() || 'Provider'}
                        </strong>
                      </span>
                    </div>
                  </div>

                  <BookingStatusBadge status={booking.status} />
                </div>

                {/* Details Grid */}
                <div className="mt-6 grid gap-4 border-t pt-4 sm:grid-cols-3">
                  {/* Price */}
                  <div className="space-y-1">
                    <p className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                      <IndianRupee className="h-3.5 w-3.5" />
                      <span>Total Amount</span>
                    </p>

                    <p className="text-base font-bold text-foreground">
                      ₹{Number(booking.price).toLocaleString('en-IN')}
                    </p>
                  </div>

                  {/* Date & Time */}
                  <div className="space-y-1">
                    <p className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Scheduled For</span>
                    </p>

                    <p className="text-sm font-semibold text-foreground">
                      {formatDate(booking.scheduledAt)}
                    </p>
                  </div>

                  {/* Address */}
                  <div className="space-y-1">
                    <p className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>Service Location</span>
                    </p>

                    <p className="text-sm font-semibold text-foreground">
                      {booking.address.label}
                    </p>

                    <p className="whitespace-pre-line text-xs text-muted-foreground">
                      {[booking.address.addressLine, booking.address.city, booking.address.state, booking.address.pincode]
                        .map((part) => part?.trim()).filter(Boolean).join(', ')}
                    </p>
                  </div>
                </div>

                {/* Customer Actions */}
                {(booking.status === 'PENDING' ||
                  booking.status === 'ACCEPTED') && (
                  <div className="mt-5 border-t pt-4">
                    <CancelBookingButton bookingId={booking.id} />
                  </div>
                )}

                {booking.status === 'COMPLETED' && !booking.review && (
                  <div className="mt-5 border-t pt-4">
                    <ReviewBookingButton bookingId={booking.id} />
                  </div>
                )}

                {booking.status === 'COMPLETED' && booking.review && (
                  <div className="mt-5 border-t pt-4">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Review submitted
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
