import Link from 'next/link';
import {
  ArrowLeft,
  BriefcaseBusiness,
  IndianRupee,
  Info,
  Plus,
} from 'lucide-react';

import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { getCurrentUser } from '@/lib/auth-user';
import { prisma } from '@/lib/prisma';

import { createService } from './actions';

export default async function NewServicePage() {
  const user = await getCurrentUser();

  const provider = await prisma.provider.findUnique({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
    },
  });

  if (!provider) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl border bg-card p-8 text-center">
          <h1 className="text-2xl font-bold">Provider Profile Required</h1>

          <p className="mt-2 text-sm text-muted-foreground">
            You need a provider profile before you can create services.
          </p>

          <Link
            href="/providers/onboarding"
            className={buttonVariants({
              className: 'mt-6',
            })}
          >
            Become a Provider
          </Link>
        </div>
      </main>
    );
  }

  const categories = await prisma.category.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  return (
    <main className="min-h-screen bg-muted/20 pb-16">
      {/* Page Header */}
      <section className="border-b bg-background">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            href="/providers/services"
            className={buttonVariants({
              variant: 'ghost',
              size: 'sm',
              className: '-ml-3 gap-2 text-muted-foreground',
            })}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to My Services
          </Link>

          <div className="mt-5 flex items-start gap-4">
            <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground sm:flex">
              <BriefcaseBusiness className="h-6 w-6" />
            </div>

            <div>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Add New Service
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                Create a service listing with clear details so customers know
                exactly what you offer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Form Area */}
      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <form
          action={createService}
          className="overflow-hidden rounded-2xl border bg-card shadow-sm"
        >
          {/* Form Header */}
          <div className="border-b px-6 py-5 sm:px-8">
            <h2 className="text-lg font-bold">Service Details</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Enter the basic information customers will see when viewing your
              service.
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-8 px-6 py-7 sm:px-8 sm:py-8">
            {/* Category */}
            <div className="space-y-2">
              <label htmlFor="categoryId" className="text-sm font-semibold">
                Service Category
                <span className="ml-1 text-destructive">*</span>
              </label>

              <select
                id="categoryId"
                name="categoryId"
                required
                defaultValue=""
                className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20"
              >
                <option value="" disabled>
                  Select a service category
                </option>

                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              <p className="text-xs text-muted-foreground">
                Choose the category that best matches your service.
              </p>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-semibold">
                Service Title
                <span className="ml-1 text-destructive">*</span>
              </label>

              <Input
                id="title"
                name="title"
                placeholder="Example: Ceiling Fan Installation"
                className="h-11"
                required
              />

              <p className="text-xs text-muted-foreground">
                Use a short and clear title that tells customers what you do.
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-semibold">
                Service Description
              </label>

              <Textarea
                id="description"
                name="description"
                placeholder="Describe the work included in this service, what customers can expect, and any important details..."
                rows={6}
                className="resize-y"
              />

              <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />

                <span>
                  A clear description helps customers understand your service
                  before booking.
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <label htmlFor="price" className="text-sm font-semibold">
                Service Price
                <span className="ml-1 text-destructive">*</span>
              </label>

              <div className="relative max-w-sm">
                <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="500"
                  className="h-11 pl-9"
                  required
                />
              </div>

              <p className="text-xs text-muted-foreground">
                Enter the price customers will pay for this service.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 border-t bg-muted/30 px-6 py-5 sm:flex-row sm:justify-end sm:px-8">
            <Link
              href="/providers/services"
              className={buttonVariants({
                variant: 'outline',
                size: 'lg',
              })}
            >
              Cancel
            </Link>

            <Button type="submit" size="lg" className="gap-2">
              <Plus className="h-4 w-4" />
              Create Service
            </Button>
          </div>
        </form>
      </section>
    </main>
  );
}
