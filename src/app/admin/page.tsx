import {
  BookOpen,
  BriefcaseBusiness,
  FolderKanban,
  MessageSquareText,
  Users,
  Wrench,
} from 'lucide-react';

import { prisma } from '@/lib/prisma';

export default async function AdminDashboardPage() {
  const [
    userCount,
    providerCount,
    serviceCount,
    bookingCount,
    reviewCount,
    categoryCount,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.provider.count(),
    prisma.service.count(),
    prisma.booking.count(),
    prisma.review.count(),
    prisma.category.count(),
  ]);

  const stats = [
    {
      label: 'Users',
      value: userCount,
      icon: Users,
    },
    {
      label: 'Providers',
      value: providerCount,
      icon: BriefcaseBusiness,
    },
    {
      label: 'Services',
      value: serviceCount,
      icon: Wrench,
    },
    {
      label: 'Bookings',
      value: bookingCount,
      icon: BookOpen,
    },
    {
      label: 'Reviews',
      value: reviewCount,
      icon: MessageSquareText,
    },
    {
      label: 'Categories',
      value: categoryCount,
      icon: FolderKanban,
    },
  ];

  return (
    <main className="min-h-screen bg-muted/20">
      {/* Header */}
      <section className="border-b bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Admin Dashboard
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Manage and monitor the ServiceHub platform.
          </p>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-2xl border bg-card p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.label}
                    </p>

                    <p className="mt-2 text-3xl font-extrabold tracking-tight">
                      {stat.value}
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
