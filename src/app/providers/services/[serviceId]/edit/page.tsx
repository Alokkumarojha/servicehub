import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  IndianRupee,
  Save,
  Sparkles,
  Layers,
  FileText,
} from 'lucide-react';

import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { getCurrentUser } from '@/lib/auth-user';
import { prisma } from '@/lib/prisma';
import { updateService } from './actions';

type EditServicePageProps = {
  params: Promise<{
    serviceId: string;
  }>;
};

export default async function EditServicePage({
  params,
}: EditServicePageProps) {
  const { serviceId } = await params;

  const user = await getCurrentUser();
  if (!user) {
    notFound();
  }

  const provider = await prisma.provider.findUnique({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
    },
  });

  if (!provider) {
    notFound();
  }

  const service = await prisma.service.findFirst({
    where: {
      id: serviceId,
      providerId: provider.id,
    },
  });

  if (!service) {
    notFound();
  }

  const categories = await prisma.category.findMany({
    orderBy: {
      name: 'asc',
    },
    select: {
      id: true,
      name: true,
    },
  });

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Back Button & Header */}
      <div className="space-y-4">
        <Link
          href="/providers/services"
          className={buttonVariants({
            variant: 'ghost',
            size: 'sm',
            className:
              'gap-2 text-muted-foreground hover:text-foreground -ml-2.5',
          })}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Services</span>
        </Link>

        <div className="flex items-center justify-between border-b pb-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Edit Service
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Update details and pricing for this service listing.
            </p>
          </div>
          <div className="hidden rounded-full bg-primary/10 p-3 text-primary sm:block">
            <Sparkles className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Main Form Section */}
      <form
        action={updateService.bind(null, service.id)}
        className="mt-8 space-y-6 rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-md sm:p-8"
      >
        {/* Category Dropdown */}
        <div className="space-y-2">
          <label
            htmlFor="categoryId"
            className="flex items-center gap-2 text-sm font-semibold"
          >
            <Layers className="h-4 w-4 text-muted-foreground" />
            <span>Category</span>
          </label>

          <select
            id="categoryId"
            name="categoryId"
            required
            defaultValue={service.categoryId}
            className="flex h-11 w-full rounded-lg border border-input bg-background px-3.5 py-2 text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Service Title */}
        <div className="space-y-2">
          <label
            htmlFor="title"
            className="flex items-center gap-2 text-sm font-semibold"
          >
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span>Service Title</span>
          </label>

          <Input
            id="title"
            name="title"
            defaultValue={service.title}
            placeholder="e.g. AC Deep Cleaning & Servicing"
            className="h-11 rounded-lg"
            required
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-semibold">
            Description
          </label>

          <Textarea
            id="description"
            name="description"
            defaultValue={service.description ?? ''}
            placeholder="Briefly explain what's included in this service package..."
            className="min-h-[120px] rounded-lg resize-y"
            rows={4}
          />
        </div>

        {/* Price Input with Currency Icon */}
        <div className="space-y-2">
          <label htmlFor="price" className="text-sm font-semibold">
            Price (₹)
          </label>

          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground">
              <IndianRupee className="h-4 w-4" />
            </div>
            <Input
              id="price"
              name="price"
              type="number"
              min="1"
              step="0.01"
              defaultValue={Number(service.price)}
              placeholder="0.00"
              className="h-11 rounded-lg pl-9"
              required
            />
          </div>
        </div>

        {/* Form Action Controls */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <Link
            href="/providers/services"
            className={buttonVariants({ variant: 'outline', size: 'lg' })}
          >
            Cancel
          </Link>
          <Button type="submit" size="lg" className="gap-2">
            <Save className="h-4 w-4" />
            <span>Save Changes</span>
          </Button>
        </div>
      </form>
    </main>
  );
}
