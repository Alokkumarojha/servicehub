import { getCurrentUser } from '@/lib/auth-user';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function ProviderBookingsPage() {
  const user = await getCurrentUser();

  console.log('Current user:', user);
  // Only providers can access this page
  if (user.role !== 'PROVIDER') {
    redirect('/');
  }

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
              You don't have any service requests yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-xl border bg-card p-5 shadow-sm sm:p-6"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Service Request
                    </p>

                    <h2 className="mt-1 text-xl font-bold">
                      {booking.service.title}
                    </h2>
                  </div>

                  <span className="w-fit rounded-full border px-3 py-1 text-xs font-semibold">
                    {booking.status}
                  </span>
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
