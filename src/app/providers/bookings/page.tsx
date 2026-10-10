import { redirect } from 'next/navigation';

import { BookingStatusBadge } from '@/components/booking-status-badge';
import { BookingActions } from './booking-actions';
import { getCurrentUser } from '@/lib/auth-user';
import { prisma } from '@/lib/prisma';

export default async function ProviderBookingsPage() {
  const user = await getCurrentUser();

  // Find the provider profile linked to this user
  const provider = await prisma.provider.findUnique({
    where: {
      userId: user.id,
    },
  });

  // Provider profile must exist
  if (!provider) {
    redirect('/');
  }

  // Fetch only this provider's bookings
  const bookings = await prisma.booking.findMany({
    where: {
      providerId: provider.id,
    },
    include: {
      service: true,
      customer: true,
      address: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <main className="min-h-screen bg-background">
      <section className="border-b bg-card/50">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Booking Requests
          </h1>

          <p className="mt-1.5 text-sm text-muted-foreground">
            View and manage service requests from customers.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {bookings.length === 0 ? (
          <div className="rounded-2xl border border-dashed p-12 text-center">
            <h2 className="text-lg font-semibold">No booking requests</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              You don&apos;t have any service requests yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="min-w-0 rounded-xl border bg-card p-5 shadow-sm [overflow-wrap:anywhere] sm:p-6"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Service Request
                    </p>

                    <h2 className="mt-1 text-xl font-bold">
                      {booking.service.title}
                    </h2>
                  </div>

                  <BookingStatusBadge status={booking.status} />
                </div>

                <div className="mt-4 rounded-lg bg-muted/50 p-3">
                  <p className="text-xs font-medium text-muted-foreground">Scheduled date and time</p>
                  <time dateTime={booking.scheduledAt.toISOString()} className="mt-1 block text-base font-semibold">
                    {new Intl.DateTimeFormat('en-IN', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                      timeZone: 'Asia/Kolkata',
                    }).format(booking.scheduledAt)}{' '}
                    <span className="text-sm font-normal text-muted-foreground">IST</span>
                  </time>
                </div>

                <div className="mt-5 grid gap-4 border-t pt-4 sm:grid-cols-3">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Customer
                    </p>

                    <p className="mt-1 font-medium">{booking.customer.name}</p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Price
                    </p>

                    <p className="mt-1 font-medium">
                      ₹{Number(booking.price).toLocaleString('en-IN')}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Address
                    </p>

                    <p className="mt-1 font-medium">{booking.address.label}</p>

                    <p className="whitespace-pre-line text-xs text-muted-foreground">
                      {[booking.address.addressLine, booking.address.city, booking.address.state, booking.address.pincode]
                        .map((part) => part?.trim()).filter(Boolean).join(', ')}
                    </p>
                  </div>
                </div>

                {booking.notes?.trim() && (
                  <div className="mt-4 border-t pt-4">
                    <p className="text-xs font-medium text-muted-foreground">Customer notes</p>
                    <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed">{booking.notes}</p>
                  </div>
                )}

                {(booking.status === 'PENDING' ||
                  booking.status === 'ACCEPTED') && (
                  <BookingActions
                    bookingId={booking.id}
                    status={booking.status}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
