import { FolderKanban } from 'lucide-react';

import { prisma } from '@/lib/prisma';
import CategoryForm from './category-form';

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: 'asc',
    },
    include: {
      _count: {
        select: {
          services: true,
        },
      },
    },
  });

  return (
    <main className="min-h-screen bg-muted/20">
      <section className="border-b bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FolderKanban className="h-5 w-5" />
            </div>

            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">
                Categories
              </h1>

              <p className="mt-1 text-sm text-muted-foreground">
                Manage service categories available on ServiceHub.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
          <CategoryForm />
          <div className="grid grid-cols-[1fr_140px_140px] border-b bg-muted/40 px-6 py-3 text-sm font-medium text-muted-foreground">
            <span>Category</span>
            <span>Status</span>
            <span>Services</span>
          </div>

          {categories.length === 0 ? (
            <div className="px-6 py-12 text-center text-sm text-muted-foreground">
              No categories found.
            </div>
          ) : (
            categories.map((category) => (
              <div
                key={category.id}
                className="grid grid-cols-[1fr_140px_140px] items-center border-b px-6 py-4 last:border-b-0"
              >
                <div>
                  <p className="font-semibold">{category.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {category.slug}
                  </p>
                </div>

                <div>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                      category.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {category.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <p className="text-sm font-medium">
                  {category._count.services}
                </p>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
