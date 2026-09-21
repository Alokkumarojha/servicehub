import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { prisma } from '@/lib/prisma';

type ProvidersPageProps = {
  searchParams: Promise<{
    category?: string;
  }>;
};

export default async function ProvidersPage({
  searchParams,
}: ProvidersPageProps) {
  const { category } = await searchParams;

  const providers = await prisma.provider.findMany({
    where: {
      isVerified: true,

      ...(category
        ? {
            services: {
              some: {
                isActive: true,
                category: {
                  slug: category,
                },
              },
            },
          }
        : {}),
    },

    include: {
      user: true,

      services: {
        where: {
          isActive: true,

          ...(category
            ? {
                category: {
                  slug: category,
                },
              }
            : {}),
        },

        include: {
          category: true,
        },
      },
    },

    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <main>
      {/* Page Header */}
      <section className="border-b">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <h1 className="text-4xl font-bold">Find Providers</h1>

          <p className="mt-2 text-muted-foreground">
            Find trusted professionals for your service needs.
          </p>

          {/* Search */}
          <div className="mt-8 flex max-w-2xl gap-3">
            <input
              type="text"
              placeholder="Search providers or services..."
              className="h-10 flex-1 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />

            <Button>Search</Button>
          </div>
        </div>
      </section>

      {/* Provider List */}
      <section>
        <div className="mx-auto max-w-7xl px-4 py-12">
          {providers.length === 0 ? (
            <div className="rounded-xl border border-dashed p-12 text-center">
              <h2 className="text-lg font-semibold">No providers found</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                There are no verified providers available right now.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {providers.map((provider) => {
                const primaryService = provider.services[0];

                return (
                  <div
                    key={provider.id}
                    className="rounded-xl border p-6 transition-colors hover:bg-muted"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted font-semibold">
                        {provider.user.name.charAt(0)}
                      </div>

                      <div>
                        <h2 className="font-semibold">{provider.user.name}</h2>

                        <p className="text-sm text-muted-foreground">
                          {primaryService?.category.name ?? 'Service Provider'}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 space-y-2 text-sm">
                      <p>
                        <span className="font-medium">Experience:</span>{' '}
                        {provider.experience
                          ? `${provider.experience} years`
                          : 'Not specified'}
                      </p>

                      <p>
                        <span className="font-medium">Services:</span>{' '}
                        {provider.services.length}
                      </p>
                    </div>

                    <Button
                      className="mt-6 w-full"
                      nativeButton={false}
                      render={<Link href={`/providers/${provider.id}`} />}
                    >
                      View Profile
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
