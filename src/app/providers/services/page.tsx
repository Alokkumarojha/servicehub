import Link from 'next/link';
import { redirect } from 'next/navigation';
import { toggleServiceStatus } from './actions';
import { DeleteServiceButton } from './delete-service-button';
import {
  Plus,
  FolderPlus,
  IndianRupee,
  Tag,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Briefcase,
  Pencil,
  Power,
} from 'lucide-react';

import { buttonVariants, Button } from '@/components/ui/button';
import { getCurrentUser } from '@/lib/auth-user';
import { prisma } from '@/lib/prisma';

export default async function ProviderServicesPage() {
  const user = await getCurrentUser();

  // 1. Unauthenticated user handling
  if (!user) {
    redirect('/sign-in?redirect_url=/providers/services');
  }

  // 2. Fetch Provider & Services
  const provider = await prisma.provider.findUnique({
    where: {
      userId: user.id,
    },
    include: {
      services: {
        include: {
          category: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  // 3. If Provider Profile is not found
  if (!provider) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-card/50 p-12 text-center shadow-xs">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <AlertCircle className="h-7 w-7" />
          </div>
          <h1 className="mt-4 text-xl font-bold tracking-tight">
            Provider Profile Required
          </h1>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            You need to register as a provider before managing or adding
            services.
          </p>
          <Link
            href="/providers/onboarding"
            className={buttonVariants({
              className: 'mt-6 gap-2',
            })}
          >
            <Briefcase className="h-4 w-4" />
            <span>Become a Provider</span>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pb-16">
      {/* Page Header */}
      <section className="border-b bg-card/40 py-8 sm:py-10">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              My Services
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Manage and showcase the services you offer to your customers.
            </p>
          </div>

          <Link
            href="/providers/services/new"
            className={buttonVariants({ className: 'gap-2 shadow-xs' })}
          >
            <Plus className="h-4 w-4" />
            <span>Add Service</span>
          </Link>
        </div>
      </section>

      {/* Services List Content */}
      <div className="mx-auto max-w-5xl px-4 pt-8 sm:px-6 lg:px-8">
        {provider.services.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-card/50 p-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <FolderPlus className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-lg font-bold">No services added yet</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Start creating your service listings so customers can find and
              book your work.
            </p>
            <Link
              href="/providers/services/new"
              className={buttonVariants({
                className: 'mt-6 gap-2',
              })}
            >
              <Plus className="h-4 w-4" />
              <span>Create First Service</span>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-1">
            {provider.services.map((service) => (
              <div
                key={service.id}
                className="group relative overflow-hidden rounded-2xl border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-md sm:p-6"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  {/* Service Title & Category */}
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
                        <Tag className="h-3 w-3" />
                        {service.category.name}
                      </span>

                      {/* Active / Inactive Badge */}
                      {service.isActive ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600">
                          <CheckCircle2 className="h-3 w-3" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full border border-muted bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                          <XCircle className="h-3 w-3" />
                          Inactive
                        </span>
                      )}
                    </div>

                    <h2 className="text-xl font-bold tracking-tight text-card-foreground">
                      {service.title}
                    </h2>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-0.5 text-lg font-extrabold text-foreground sm:text-xl">
                    <IndianRupee className="h-4 w-4" />
                    <span>{Number(service.price).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Description */}
                {service.description && (
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                    {service.description}
                  </p>
                )}

                {/* Service Actions */}
                <div className="mt-5 flex flex-wrap justify-end gap-2 border-t pt-4">
                  <form
                    action={toggleServiceStatus.bind(
                      null,
                      service.id,
                      !service.isActive
                    )}
                  >
                    <Button
                      type="submit"
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <Power className="h-4 w-4" />

                      <span>
                        {service.isActive ? 'Deactivate' : 'Activate'}
                      </span>
                    </Button>
                  </form>

                  <Link
                    href={`/providers/services/${service.id}/edit`}
                    className={buttonVariants({
                      variant: 'outline',
                      size: 'sm',
                      className: 'gap-2',
                    })}
                  >
                    <Pencil className="h-4 w-4" />
                    <span>Edit Service</span>
                  </Link>
                  <DeleteServiceButton
                    serviceId={service.id}
                    serviceTitle={service.title}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
