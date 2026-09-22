import Link from 'next/link';
import { redirect } from 'next/navigation';

import { CancelBookingButton } from './cancel-booking-button';

import {
  Calendar,
  MapPin,
  User,
  IndianRupee,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  CalendarX2,
  ArrowRight,
} from 'lucide-react';

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

// Status badge helper function with corresponding icons
function renderStatusBadge(status: string) {
  const normalizedStatus = status.toUpperCase();

  switch (normalizedStatus) {
    case 'PENDING':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-xs font-semibold text-yellow-600">
          <Clock className="h-3.5 w-3.5" />
          Pending
        </span>
      );
    case 'ACCEPTED':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-600">
          <AlertCircle className="h-3.5 w-3.5" />
          Accepted
        </span>
      );
    case 'COMPLETED':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-600">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Completed
        </span>
      );
    case 'CANCELLED':
    case 'REJECTED':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-600">
          <XCircle className="h-3.5 w-3.5" />
          {normalizedStatus === 'CANCELLED' ? 'Cancelled' : 'Rejected'}
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
          {status}
        </span>
      );
  }
}

export default async function MyBookingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/sign-in?redirect_url=/my-bookings');
  }

  // 2. Fetch customer bookings
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
              You haven't requested any service bookings yet. Explore our top
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
                className="overflow-hidden rounded-2xl border bg-card p-5 shadow-sm transition-all hover:shadow-md sm:p-6"
              >
                {/* Header Info & Status */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Service Booking
                    </span>
                    <h2 className="text-xl font-bold text-card-foreground">
                      {booking.service.title}
                    </h2>
                    <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground sm:text-sm">
                      <User className="h-3.5 w-3.5" />
                      <span>
                        Provider:{' '}
                        <strong className="font-semibold text-foreground">
                          {booking.provider.user.name}
                        </strong>
                      </span>
                    </div>
                  </div>

                  <div>{renderStatusBadge(booking.status)}</div>
                </div>

                {/* Details Grid */}
                <div className="mt-6 grid gap-4 border-t pt-4 sm:grid-cols-3">
                  {/* Price */}
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                      <IndianRupee className="h-3.5 w-3.5" />
                      <span>Total Amount</span>
                    </p>
                    <p className="text-base font-bold text-foreground">
                      ₹{Number(booking.price).toLocaleString('en-IN')}
                    </p>
                  </div>

                  {/* Date & Time */}
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Scheduled For</span>
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {formatDate(booking.scheduledAt)}
                    </p>
                  </div>

                  {/* Address */}
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>Service Location</span>
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {booking.address.label}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {booking.address.addressLine}, {booking.address.city} -{' '}
                      {booking.address.pincode}
                    </p>
                  </div>
                </div>
                {/* Cancel Booking */}
                {(booking.status === 'PENDING' ||
                  booking.status === 'ACCEPTED') && (
                  <div className="mt-5 border-t pt-4">
                    <CancelBookingButton bookingId={booking.id} />
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
