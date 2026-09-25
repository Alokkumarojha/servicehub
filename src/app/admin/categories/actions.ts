'use server';

import { revalidatePath } from 'next/cache';

import { getCurrentUser } from '@/lib/auth-user';
import { prisma } from '@/lib/prisma';

export type CategoryFormState = {
  success: boolean;
  message: string;
};

export async function createCategory(
  _previousState: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  const user = await getCurrentUser();

  if (user.role !== 'ADMIN') {
    return {
      success: false,
      message: 'You are not authorized to perform this action.',
    };
  }

  const name = formData.get('name');

  if (typeof name !== 'string' || !name.trim()) {
    return {
      success: false,
      message: 'Category name is required.',
    };
  }

  const cleanName = name.trim();

  const slug = cleanName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (!slug) {
    return {
      success: false,
      message: 'Please enter a valid category name.',
    };
  }

  const existingCategory = await prisma.category.findFirst({
    where: {
      OR: [
        {
          name: {
            equals: cleanName,
            mode: 'insensitive',
          },
        },
        {
          slug,
        },
      ],
    },
  });

  if (existingCategory) {
    return {
      success: false,
      message: 'Category already exists.',
    };
  }

  await prisma.category.create({
    data: {
      name: cleanName,
      slug,
    },
  });

  revalidatePath('/admin/categories');

  return {
    success: true,
    message: 'Category created successfully.',
  };
}
