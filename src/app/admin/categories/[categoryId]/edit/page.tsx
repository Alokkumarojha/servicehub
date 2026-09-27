import { notFound } from 'next/navigation';
import EditCategoryForm from './edit-category-form';

import { prisma } from '@/lib/prisma';

type EditCategoryPageProps = {
  params: Promise<{
    categoryId: string;
  }>;
};

export default async function EditCategoryPage({
  params,
}: EditCategoryPageProps) {
  const { categoryId } = await params;

  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  if (!category) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Category</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Update the category name.
        </p>
      </div>

      <EditCategoryForm
        categoryId={category.id}
        name={category.name}
        slug={category.slug}
      />
    </main>
  );
}
