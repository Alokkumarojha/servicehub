import { getCurrentUser } from '@/lib/auth-user';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

// Date formatting helper function
function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date));
}

// Status styling helper function
function getStatusBadge(status: string) {
  const styles: Record<string, string> = {
    PENDING: 'bg-yellow-500/10 text-yellow-600 border-yellow-200',
    ACCEPTED: 'bg-blue-500/10 text-blue-600 border-blue-200',
    COMPLETED: 'bg-green-500/10 text-green-600 border-green-200',
    CANCELLED: 'bg-red-500/10 text-red-600 border-red-200',
    REJECTED: 'bg-red-500/10 text-red-600 border-red-200',
  };

  return (
    styles[status.toUpperCase()] ||
    'bg-muted text-muted-foreground border-border'
  );
}

export default async function MyBookingsPage() {
  const user = await getCurrentUser();

  // 1. Unauthenticated user handling
  if (!user) {
    redirect('/sign-in');
  }

  // 2. Fetch bookings
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
    <main className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="border-b bg-card/50">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight">My Bookings</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            View your service bookings and track their current status.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed p-12 text-center">
            <h3 className="text-lg font-semibold">No bookings found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              You haven't booked any services yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="overflow-hidden rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md sm:p-6"
              >
                {/* Header Info & Status */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Service
                    </span>
                    <h2 className="text-xl font-bold text-card-foreground">
                      {booking.service.title}
                    </h2>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      Provider:{' '}
                      <span className="font-medium text-foreground">
                        {booking.provider.user.name}
                      </span>
                    </p>
                  </div>

                  <span
                    className={`w-fit rounded-full border px-3 py-1 text-xs font-semibold capitalize ${getStatusBadge(
                      booking.status
                    )}`}
                  >
                    {booking.status.toLowerCase()}
                  </span>
                </div>

                {/* Details Grid */}
                <div className="mt-6 grid gap-4 border-t pt-4 sm:grid-cols-3">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Price
                    </p>
                    <p className="mt-1 text-base font-semibold text-foreground">
                      ₹{Number(booking.service.price).toLocaleString('en-IN')}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Scheduled Date & Time
                    </p>
                    <p className="mt-1 text-sm font-medium text-foreground">
                      {formatDate(booking.scheduledAt)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Service Address
                    </p>
                    <p className="mt-1 text-sm font-medium text-foreground">
                      {booking.address.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {booking.address.addressLine}, {booking.address.city}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
