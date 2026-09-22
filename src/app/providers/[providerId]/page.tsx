import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  CheckCircle2,
  Mail,
  Briefcase,
  ShieldCheck,
  Calendar,
  ArrowRight,
  Clock,
} from 'lucide-react';

import { buttonVariants } from '@/components/ui/button';
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

  const primaryCategory =
    provider.services[0]?.category.name ?? 'Service Provider';

  return (
    <main className="min-h-screen bg-background pb-16">
      {/* Provider Header Hero */}
      <section className="border-b bg-card/40 py-10 sm:py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            {/* Avatar */}
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-3xl font-bold text-primary shadow-inner">
              {provider.user.name.charAt(0).toUpperCase()}
            </div>

            {/* Basic Info */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                  {provider.user.name}
                </h1>
                {provider.isVerified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-600 border border-blue-200">
                    <CheckCircle2 className="h-3.5 w-3.5 fill-blue-600 text-white" />
                    Verified
                  </span>
                )}
              </div>

              <p className="text-base font-medium text-muted-foreground">
                {primaryCategory}
              </p>

              <div className="flex flex-wrap gap-4 pt-1 text-xs text-muted-foreground sm:text-sm">
                <div className="flex items-center gap-1.5">
                  <Briefcase className="h-4 w-4" />
                  <span>
                    {provider.experience
                      ? `${provider.experience} years experience`
                      : 'Experience not specified'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Mail className="h-4 w-4" />
                  <span>{provider.user.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="pt-8">
        <div className="mx-auto grid max-w-5xl gap-8 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          {/* Main Column: About & Services */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <h2 className="text-xl font-bold tracking-tight">
                About Provider
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                {provider.bio ??
                  'This provider has not added a bio description yet.'}
              </p>
            </div>

            {/* Services Offered Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold tracking-tight">
                  Services Offered
                </h2>
                <span className="text-xs font-medium text-muted-foreground">
                  {provider.services.length} available
                </span>
              </div>

              {provider.services.length === 0 ? (
                <div className="rounded-2xl border border-dashed p-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    No active services available right now.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {provider.services.map((service) => (
                    <div
                      key={service.id}
                      className="group flex flex-col justify-between rounded-xl border bg-card p-5 shadow-sm transition-all hover:border-primary/50 hover:shadow-md sm:p-6"
                    >
                      <div>
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                              {service.category.name}
                            </span>
                            <h3 className="text-lg font-bold text-card-foreground">
                              {service.title}
                            </h3>
                          </div>

                          <div className="w-fit rounded-lg bg-muted px-3 py-1 text-base font-bold text-foreground">
                            ₹{Number(service.price).toLocaleString('en-IN')}
                          </div>
                        </div>

                        {service.description && (
                          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                            {service.description}
                          </p>
                        )}
                      </div>

                      {/* Action Button */}
                      <div className="mt-5 border-t pt-4">
                        <Link
                          href={`/booking?serviceId=${service.id}`}
                          className={buttonVariants({
                            className:
                              'w-full justify-between group-hover:bg-primary',
                          })}
                        >
                          <span>Book This Service</span>
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Column: Provider Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 rounded-2xl border bg-card p-6 shadow-sm space-y-5">
              <h3 className="text-lg font-bold tracking-tight border-b pb-3">
                Provider Summary
              </h3>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Status</p>
                    <p className="font-semibold text-foreground">
                      {provider.isVerified
                        ? 'Verified Professional'
                        : 'Pending Verification'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Briefcase className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Experience</p>
                    <p className="font-semibold text-foreground">
                      {provider.experience
                        ? `${provider.experience} Years`
                        : 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Active Services
                    </p>
                    <p className="font-semibold text-foreground">
                      {provider.services.length} Listed
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Member Since
                    </p>
                    <p className="font-semibold text-foreground">
                      {new Date(provider.createdAt).getFullYear()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
