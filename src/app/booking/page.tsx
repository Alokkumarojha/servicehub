import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  FileText,
  CheckCircle2,
} from 'lucide-react';

import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { getCurrentUser } from '@/lib/auth-user';
import { prisma } from '@/lib/prisma';
import { createBooking } from './actions';

type BookingPageProps = {
  searchParams: Promise<{
    serviceId?: string;
  }>;
};

export default async function BookingPage({ searchParams }: BookingPageProps) {
  const { serviceId } = await searchParams;

  // 1. Auth Guard (Prevents null user crash)
  const user = await getCurrentUser();
  if (!user) {
    redirect(
      `/login?callbackUrl=/booking${serviceId ? `?serviceId=${serviceId}` : ''}`
    );
  }

  // 2. Fetch User Addresses
  const addresses = await prisma.address.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // 3. Fetch Active Services
  const services = await prisma.service.findMany({
    where: {
      isActive: true,
      ...(serviceId ? { id: serviceId } : {}),
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

  // Minimum selectable date (Today in YYYY-MM-DD)
  const minDate = new Date().toISOString().split('T')[0];

  return (
    <main className="min-h-screen bg-background pb-16">
      {/* Header */}
      <section className="border-b bg-card/40 py-8 sm:py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Book a Service
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Provide the booking details below to schedule your service.
          </p>
        </div>
      </section>

      {/* Main Booking Form */}
      <section className="pt-8">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <form
            action={createBooking}
            className="space-y-8 rounded-2xl border bg-card p-6 shadow-sm sm:p-8"
          >
            {/* 1. Select Service */}
            <div className="space-y-2">
              <label
                htmlFor="serviceId"
                className="text-sm font-semibold text-foreground flex items-center gap-2"
              >
                <span>Select Service</span>
                <span className="text-destructive">*</span>
              </label>

              <select
                id="serviceId"
                name="serviceId"
                required
                defaultValue={serviceId ?? ''}
                className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="" disabled>
                  -- Choose a service --
                </option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.title} — ₹
                    {Number(service.price).toLocaleString('en-IN')} (
                    {service.provider.user.name})
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Date & Time Grid */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="date"
                  className="text-sm font-semibold text-foreground flex items-center gap-1.5"
                >
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Preferred Date</span>
                  <span className="text-destructive">*</span>
                </label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  min={minDate}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="time"
                  className="text-sm font-semibold text-foreground flex items-center gap-1.5"
                >
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Preferred Time</span>
                  <span className="text-destructive">*</span>
                </label>
                <Input
                  id="time"
                  name="time"
                  type="time"
                  required
                  className="h-11"
                />
              </div>
            </div>

            {/* 3. Address Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>Service Address</span>
                  <span className="text-destructive">*</span>
                </label>

                <Link
                  href={`/addresses?returnTo=/booking${serviceId ? `?serviceId=${serviceId}` : ''}`}
                  className={buttonVariants({
                    variant: 'outline',
                    size: 'sm',
                    className: 'gap-1 text-xs',
                  })}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add New
                </Link>
              </div>

              {addresses.length === 0 ? (
                <div className="rounded-xl border border-dashed p-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    No saved addresses found. Please add a new service location
                    first.
                  </p>
                  <Link
                    href={`/addresses?returnTo=/booking${serviceId ? `?serviceId=${serviceId}` : ''}`}
                    className={buttonVariants({
                      className: 'mt-3',
                      size: 'sm',
                    })}
                  >
                    Add Address Now
                  </Link>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {addresses.map((address, index) => (
                    <label
                      key={address.id}
                      className="relative flex cursor-pointer flex-col justify-between rounded-xl border bg-background p-4 shadow-sm transition-all has-[:checked]:border-primary has-[:checked]:bg-primary/5 has-[:checked]:ring-1 has-[:checked]:ring-primary hover:border-muted-foreground/40"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-sm">
                          {address.label}
                        </span>
                        <input
                          type="radio"
                          name="addressId"
                          value={address.id}
                          required
                          defaultChecked={index === 0}
                          className="h-4 w-4 accent-primary"
                        />
                      </div>

                      <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                        {address.addressLine}, {address.city}, {address.state} -{' '}
                        {address.pincode}
                      </p>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* 4. Notes */}
            <div className="space-y-2">
              <label
                htmlFor="notes"
                className="text-sm font-semibold text-foreground flex items-center gap-1.5"
              >
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span>Additional Notes (Optional)</span>
              </label>

              <Textarea
                id="notes"
                name="notes"
                placeholder="E.g., Please call before arriving, bring extra wire length..."
                rows={3}
                className="resize-none"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              className="w-full text-base font-semibold"
            >
              Confirm & Request Service
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
}
