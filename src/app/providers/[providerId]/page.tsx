import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { prisma } from '@/lib/prisma';

type ProviderProfilePageProps = {
  params: Promise<{
    providerId: string;
  }>;
};

export default async function ProviderProfilePage({
  params,
}: ProviderProfilePageProps) {
  const { providerId } = await params;

  const provider = await prisma.provider.findUnique({
    where: {
      id: providerId,
    },
    include: {
      user: true,
      services: {
        where: {
          isActive: true,
        },
        include: {
          category: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  if (!provider) {
    notFound();
  }

  return (
    <main>
      {/* Provider Header */}
      <section className="border-b">
        <div className="mx-auto max-w-4xl px-4 py-12">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-muted text-3xl font-bold">
              {provider.user.name.charAt(0)}
            </div>

            <div>
              <h1 className="text-3xl font-bold">{provider.user.name}</h1>

              <p className="mt-1 text-lg text-muted-foreground">
                {provider.services[0]?.category.name ?? 'Service Provider'}
              </p>

              <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span>
                  {provider.experience
                    ? `${provider.experience} years experience`
                    : 'Experience not specified'}
                </span>

                <span>{provider.user.email}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Provider Details */}
      <section>
        <div className="mx-auto grid max-w-4xl gap-8 px-4 py-12 md:grid-cols-3">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold">About</h2>

            <p className="mt-4 leading-7 text-muted-foreground">
              {provider.bio ?? 'This provider has not added a bio yet.'}
            </p>

            <h2 className="mt-10 text-2xl font-bold">Services Offered</h2>

            {provider.services.length === 0 ? (
              <p className="mt-4 text-muted-foreground">
                No active services available.
              </p>
            ) : (
              <div className="mt-5 space-y-4">
                {provider.services.map((service) => (
                  <div key={service.id} className="rounded-lg border p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="font-semibold">{service.title}</h3>

                        <p className="mt-1 text-sm text-muted-foreground">
                          {service.category.name}
                        </p>
                      </div>

                      <p className="font-semibold">
                        ₹{Number(service.price).toLocaleString('en-IN')}
                      </p>
                    </div>

                    {service.description && (
                      <p className="mt-3 text-sm leading-6 text-muted-foreground">
                        {service.description}
                      </p>
                    )}

                    <Button
                      className="mt-4"
                      nativeButton={false}
                      render={
                        <Link href={`/booking?serviceId=${service.id}`} />
                      }
                    >
                      Book Service
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Provider Summary */}
          <div className="h-fit rounded-xl border p-6">
            <h2 className="text-xl font-semibold">Provider Details</h2>

            <div className="mt-5 space-y-4 text-sm">
              <div>
                <p className="text-muted-foreground">Name</p>
                <p className="mt-1 font-medium">{provider.user.name}</p>
              </div>

              <div>
                <p className="text-muted-foreground">Email</p>
                <p className="mt-1 break-all font-medium">
                  {provider.user.email}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground">Services</p>
                <p className="mt-1 font-medium">{provider.services.length}</p>
              </div>

              <div>
                <p className="text-muted-foreground">Verification</p>
                <p className="mt-1 font-medium">
                  {provider.isVerified
                    ? 'Verified Provider'
                    : 'Verification Pending'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
