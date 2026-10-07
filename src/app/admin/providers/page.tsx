import { BriefcaseBusiness } from 'lucide-react';
import ProviderVerificationButton from './provider-verification-button';

import { prisma } from '@/lib/prisma';

export default async function AdminProvidersPage() {
  const providers = await prisma.provider.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          phone: true,
        },
      },
      _count: {
        select: {
          services: true,
          bookings: true,
          reviews: true,
        },
      },
    },
  });

  return (
    <main className="min-h-screen bg-muted/20">
      {/* Header */}
      <section className="border-b bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <BriefcaseBusiness className="h-5 w-5" />
            </div>

            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">
                Providers
              </h1>

              <p className="mt-1 text-sm text-muted-foreground">
                Manage service providers registered on ServiceHub.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Providers */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
          <div className="grid-cols-[minmax(0,1fr)_130px_100px_120px_100px_100px_130px] border-b bg-muted/40 px-6 py-3 text-sm font-medium text-muted-foreground">
            <span>Provider</span>
            <span className="text-center">Status</span>
            <span className="text-center">Services</span>
            <span className="text-center">Experience</span>
            <span className="text-center">Bookings</span>
            <span className="text-center">Reviews</span>
            <span className="text-right">Actions</span>
          </div>

          {providers.length === 0 ? (
            <div className="px-6 py-12 text-center text-sm text-muted-foreground">
              No providers found.
            </div>
          ) : (
            providers.map((provider) => (
              <div
                key={provider.id}
                className="grid grid-cols-[minmax(0,1fr)_130px_100px_120px_100px_100px_130px] items-center border-b px-6 py-4 last:border-b-0"
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold">{provider.user.name}</p>

                  <p className="truncate text-sm text-muted-foreground">
                    {provider.user.email}
                  </p>

                  {provider.user.phone && (
                    <p className="truncate text-xs text-muted-foreground">
                      {provider.user.phone}
                    </p>
                  )}
                </div>

                <div className="flex justify-center">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                      provider.isVerified
                        ? 'bg-green-100 text-green-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {provider.isVerified ? 'Verified' : 'Pending'}
                  </span>
                </div>

                <p className="text-center text-sm font-medium">
                  {provider._count.services}
                </p>

                <p className="text-center text-sm">
                  {provider.experience != null
                    ? `${provider.experience} ${
                        provider.experience === 1 ? 'year' : 'years'
                      }`
                    : '—'}
                </p>

                <p className="text-center text-sm font-medium">
                  {provider._count.bookings}
                </p>

                <p className="text-center text-sm font-medium">
                  {provider._count.reviews}
                </p>

                <div className="flex justify-end">
                  <ProviderVerificationButton
                    providerId={provider.id}
                    isVerified={provider.isVerified}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
