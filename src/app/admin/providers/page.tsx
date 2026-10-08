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
        {providers.length === 0 ? (
          <div className="rounded-2xl border bg-card px-6 py-12 text-center text-sm text-muted-foreground">
            No providers found.
          </div>
        ) : (
          <div className="lg:rounded-2xl lg:border lg:bg-card lg:shadow-sm">
            <table role="table" className="block w-full text-left text-sm lg:table lg:table-fixed">
              <caption className="sr-only">Providers, verification status, and activity</caption>
              <thead role="rowgroup" className="sr-only lg:not-sr-only lg:table-header-group">
                <tr role="row" className="border-b text-muted-foreground">
                  <th scope="col" className="w-[28%] px-3 py-3 font-medium">Provider</th>
                  <th scope="col" className="px-3 py-3 font-medium">Status</th>
                  <th scope="col" className="px-3 py-3 font-medium">Services</th>
                  <th scope="col" className="px-3 py-3 font-medium">Experience</th>
                  <th scope="col" className="px-3 py-3 font-medium">Bookings</th>
                  <th scope="col" className="px-3 py-3 font-medium">Reviews</th>
                  <th scope="col" className="w-32 px-3 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody role="rowgroup" className="grid gap-4 lg:table-row-group">
                {providers.map((provider) => (
                  <tr key={provider.id} role="row" className="grid min-w-0 grid-cols-2 gap-4 rounded-xl border bg-card p-4 lg:table-row lg:rounded-none lg:border-0 lg:border-b lg:p-0 lg:last:border-b-0">
                    <th scope="row" role="rowheader" className="col-span-2 block min-w-0 text-left font-normal [overflow-wrap:anywhere] lg:table-cell lg:px-3 lg:py-4">
                      <span className="block font-semibold">{provider.user.name}</span>
                      <span className="block text-muted-foreground">{provider.user.email}</span>
                      {provider.user.phone && <span className="block text-xs text-muted-foreground">{provider.user.phone}</span>}
                    </th>
                    <td role="cell" className="block lg:table-cell lg:px-3 lg:py-4">
                      <span aria-hidden="true" className="mb-1 block text-xs text-muted-foreground lg:hidden">Status</span>
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${provider.isVerified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {provider.isVerified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td role="cell" className="block lg:table-cell lg:px-3 lg:py-4">
                      <span aria-hidden="true" className="mb-1 block text-xs text-muted-foreground lg:hidden">Services</span>
                      {provider._count.services}
                    </td>
                    <td role="cell" className="block lg:table-cell lg:px-3 lg:py-4">
                      <span aria-hidden="true" className="mb-1 block text-xs text-muted-foreground lg:hidden">Experience</span>
                      {provider.experience != null ? `${provider.experience} ${provider.experience === 1 ? 'year' : 'years'}` : '—'}
                    </td>
                    <td role="cell" className="block lg:table-cell lg:px-3 lg:py-4">
                      <span aria-hidden="true" className="mb-1 block text-xs text-muted-foreground lg:hidden">Bookings</span>
                      {provider._count.bookings}
                    </td>
                    <td role="cell" className="block lg:table-cell lg:px-3 lg:py-4">
                      <span aria-hidden="true" className="mb-1 block text-xs text-muted-foreground lg:hidden">Reviews</span>
                      {provider._count.reviews}
                    </td>
                    <td role="cell" className="col-span-2 block lg:table-cell lg:px-3 lg:py-4">
                      <ProviderVerificationButton providerId={provider.id} isVerified={provider.isVerified} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
