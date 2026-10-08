import { FolderKanban } from 'lucide-react';
import Link from 'next/link';

import { prisma } from '@/lib/prisma';
import CategoryForm from './category-form';

import CategoryStatusButton from './category-status-button';
import { DeleteCategoryButton } from './delete-category-button';

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
        <CategoryForm />
        {categories.length === 0 ? (
          <div className="rounded-2xl border bg-card px-6 py-12 text-center text-sm text-muted-foreground">
            No categories found.
          </div>
        ) : (
          <div className="lg:rounded-2xl lg:border lg:bg-card lg:shadow-sm">
            <table role="table" className="block w-full text-left text-sm lg:table lg:table-fixed">
              <caption className="sr-only">Service categories and management actions</caption>
              <thead role="rowgroup" className="sr-only lg:not-sr-only lg:table-header-group">
                <tr role="row" className="border-b text-muted-foreground">
                  <th scope="col" className="px-4 py-3 font-medium">Category</th>
                  <th scope="col" className="w-28 px-4 py-3 font-medium">Status</th>
                  <th scope="col" className="w-24 px-4 py-3 font-medium">Services</th>
                  <th scope="col" className="w-80 px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody role="rowgroup" className="grid gap-4 lg:table-row-group">
                {categories.map((category) => (
                  <tr key={category.id} role="row" className="grid min-w-0 grid-cols-2 gap-4 rounded-xl border bg-card p-4 lg:table-row lg:rounded-none lg:border-0 lg:border-b lg:p-0 lg:last:border-b-0">
                    <th scope="row" role="rowheader" className="col-span-2 block min-w-0 text-left font-normal [overflow-wrap:anywhere] lg:table-cell lg:px-4 lg:py-4">
                      <span className="block font-semibold">{category.name}</span>
                      <span className="block text-muted-foreground">{category.slug}</span>
                    </th>
                    <td role="cell" className="block lg:table-cell lg:px-4 lg:py-4">
                      <span aria-hidden="true" className="mb-1 block text-xs text-muted-foreground lg:hidden">Status</span>
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${category.isActive ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'}`}>
                        {category.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td role="cell" className="block lg:table-cell lg:px-4 lg:py-4">
                      <span aria-hidden="true" className="mb-1 block text-xs text-muted-foreground lg:hidden">Services</span>
                      {category._count.services}
                    </td>
                    <td role="cell" className="col-span-2 block min-w-0 lg:table-cell lg:px-4 lg:py-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link href={`/admin/categories/${category.id}/edit`} className="inline-flex min-h-11 items-center rounded-md border px-3 py-2 font-medium transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
                          Edit
                        </Link>
                        <CategoryStatusButton categoryId={category.id} isActive={category.isActive} />
                        <DeleteCategoryButton categoryId={category.id} categoryName={category.name} />
                      </div>
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
