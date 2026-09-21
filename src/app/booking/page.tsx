import { Button } from '@/components/ui/button';
import { getCurrentUser } from '@/lib/auth-user';
import { prisma } from '@/lib/prisma';
import { createBooking } from './actions';
import Link from 'next/link';

type BookingPageProps = {
  searchParams: Promise<{
    serviceId?: string;
  }>;
};

export default async function BookingPage({ searchParams }: BookingPageProps) {
  const { serviceId } = await searchParams;

  const user = await getCurrentUser();

  const addresses = await prisma.address.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const services = await prisma.service.findMany({
    where: {
      isActive: true,

      ...(serviceId
        ? {
            id: serviceId,
          }
        : {}),
    },
    include: {
      provider: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return (
    <main>
      <section className="border-b">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <h1 className="text-3xl font-bold">Book a Service</h1>

          <p className="mt-2 text-muted-foreground">
            Provide the details below to request a service.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-3xl px-4 py-12">
          <form
            action={createBooking}
            className="space-y-8 rounded-xl border p-6"
          >
            {/* Service */}
            <div>
              <label className="text-sm font-medium">Service</label>

              <select
                name="serviceId"
                defaultValue={serviceId ?? ''}
                className="mt-2 h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="" disabled>
                  Select a service
                </option>

                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.title} - ₹{service.price.toString()}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="text-sm font-medium">Preferred Date</label>

              <input
                name="date"
                type="date"
                className="mt-2 h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Time */}
            <div>
              <label className="text-sm font-medium">Preferred Time</label>

              <input
                name="time"
                type="time"
                className="mt-2 h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Address */}
            <div>
              <label className="text-sm font-medium">Service Address</label>

              {addresses.length === 0 ? (
                <p className="mt-2 text-sm text-muted-foreground">
                  No saved addresses found.
                </p>
              ) : (
                <div className="mt-2 space-y-3">
                  {addresses.map((address) => (
                    <label
                      key={address.id}
                      className="flex cursor-pointer gap-3 rounded-lg border p-4"
                    >
                      <input type="radio" name="addressId" value={address.id} />

                      <div>
                        <p className="font-medium">{address.label}</p>

                        <p className="text-sm text-muted-foreground">
                          {address.addressLine}, {address.city}, {address.state}{' '}
                          - {address.pincode}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              <Link
                href="/addresses?returnTo=/booking"
                className="mt-3 inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
              >
                + Add New Address
              </Link>
            </div>

            {/* Notes */}
            <div>
              <label className="text-sm font-medium">Additional Notes</label>

              <textarea
                name="notes"
                placeholder="Describe your problem or requirements..."
                rows={4}
                className="mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <Button type="submit" className="w-full">
              Request Service
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
}
