import Link from 'next/link';
import {
  Search,
  CheckCircle2,
  Briefcase,
  Wrench,
  ArrowRight,
  Star,
} from 'lucide-react';

import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { prisma } from '@/lib/prisma';

type ProvidersPageProps = {
  searchParams: Promise<{
    category?: string;
    q?: string;
  }>;
};

export default async function ProvidersPage({
  searchParams,
}: ProvidersPageProps) {
  const { category, q } = await searchParams;

  const providers = await prisma.provider.findMany({
    where: {
      isVerified: true,

      // Filter by text search query if present
      ...(q
        ? {
            OR: [
              { user: { name: { contains: q, mode: 'insensitive' } } },
              { bio: { contains: q, mode: 'insensitive' } },
              {
                services: {
                  some: {
                    title: { contains: q, mode: 'insensitive' },
                  },
                },
              },
            ],
          }
        : {}),

      // Filter by category slug if present
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

      reviews: {
        select: {
          rating: true,
        },
      },

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
    <main className="min-h-screen bg-background">
      {/* Header & Search Section */}
      <section className="border-b bg-card/40 py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Find Verified Providers
            </h1>

            <p className="mt-2 text-base text-muted-foreground">
              Discover trusted background-checked service professionals near
              you.
            </p>

            {/* Functional Search Form */}
            <form
              action="/providers"
              method="GET"
              className="mt-6 flex max-w-lg gap-2"
            >
              {category && (
                <input type="hidden" name="category" value={category} />
              )}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  name="q"
                  defaultValue={q ?? ''}
                  placeholder="Search provider name or service..."
                  className="pl-9"
                />
              </div>
              <Button type="submit">Search</Button>
            </form>
          </div>
        </div>
      </section>

      {/* Provider List Grid */}
      <section className="py-10 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {providers.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed p-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h2 className="mt-4 text-lg font-semibold">No providers found</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                We couldn't find any verified providers matching your criteria.
              </p>
              {(q || category) && (
                <Link
                  href="/providers"
                  className={buttonVariants({
                    variant: 'outline',
                    className: 'mt-5',
                  })}
                >
                  Clear Filters
                </Link>
              )}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {providers.map((provider) => {
                const primaryCategory = provider.services[0]?.category?.name;
                const reviewCount = provider.reviews.length;
                const averageRating =
                  reviewCount > 0
                    ? provider.reviews.reduce(
                        (total, review) => total + review.rating,
                        0
                      ) / reviewCount
                    : 0;

                return (
                  <div
                    key={provider.id}
                    className="group flex flex-col justify-between rounded-2xl border bg-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div>
                      {/* Avatar & Header */}
                      <div className="flex items-start gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                          {provider.user.name.charAt(0).toUpperCase()}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <h2 className="truncate text-lg font-bold tracking-tight">
                              {provider.user.name}
                            </h2>
                            <CheckCircle2 className="h-4 w-4 shrink-0 fill-blue-500 text-white" />
                          </div>

                          <span className="inline-block rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                            {primaryCategory ?? 'General Provider'}
                          </span>
                          <div className="mt-2 flex items-center gap-1.5">
                            <Star
                              className={`h-4 w-4 ${
                                reviewCount > 0
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-muted-foreground'
                              }`}
                            />

                            {reviewCount > 0 ? (
                              <>
                                <span className="text-sm font-semibold">
                                  {averageRating.toFixed(1)}
                                </span>

                                <span className="text-xs text-muted-foreground">
                                  ({reviewCount}{' '}
                                  {reviewCount === 1 ? 'review' : 'reviews'})
                                </span>
                              </>
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                No reviews yet
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Meta Info */}
                      <div className="mt-6 grid grid-cols-2 gap-2 border-t pt-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Briefcase className="h-3.5 w-3.5" />
                          <span>
                            {provider.experience
                              ? `${provider.experience} yrs exp`
                              : 'Experienced'}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Wrench className="h-3.5 w-3.5" />
                          <span>
                            {provider.services.length} Services Offered
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* View Profile Action */}
                    <div className="mt-6">
                      <Link
                        href={`/providers/${provider.id}`}
                        className={buttonVariants({
                          variant: 'outline',
                          className:
                            'w-full justify-between group-hover:bg-accent',
                        })}
                      >
                        <span>View Profile</span>
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
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
