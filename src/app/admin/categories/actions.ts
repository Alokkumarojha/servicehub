'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { getCurrentUser } from '@/lib/auth-user';
import { prisma } from '@/lib/prisma';

export type CategoryFormState = {
  success: boolean;
  message: string;
};
export type EditCategoryState = {
  success: boolean;
  message: string;
};

// =========================
// CREATE CATEGORY
// =========================

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

// =========================
// TOGGLE CATEGORY STATUS
// =========================

export async function toggleCategoryStatus(
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

  const categoryId = formData.get('categoryId');

  if (typeof categoryId !== 'string' || !categoryId) {
    return {
      success: false,
      message: 'Category ID is required.',
    };
  }

  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  if (!category) {
    return {
      success: false,
      message: 'Category not found.',
    };
  }

  const updatedCategory = await prisma.category.update({
    where: {
      id: category.id,
    },
    data: {
      isActive: !category.isActive,
    },
  });

  revalidatePath('/admin/categories');

  return {
    success: true,
    message: updatedCategory.isActive
      ? 'Category activated successfully.'
      : 'Category deactivated successfully.',
  };
}

// =========================
// Update category
// =========================
export async function updateCategory(
  _previousState: EditCategoryState,
  formData: FormData
): Promise<EditCategoryState> {
  const user = await getCurrentUser();

  if (user.role !== 'ADMIN') {
    return {
      success: false,
      message: 'You are not authorized to perform this action.',
    };
  }

  const categoryId = formData.get('categoryId');
  const name = formData.get('name');

  if (
    typeof categoryId !== 'string' ||
    !categoryId ||
    typeof name !== 'string' ||
    !name.trim()
  ) {
    return {
      success: false,
      message: 'Please enter a valid category name.',
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

  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  if (!category) {
    return {
      success: false,
      message: 'Category not found.',
    };
  }

  const duplicateCategory = await prisma.category.findFirst({
    where: {
      AND: [
        {
          id: {
            not: categoryId,
          },
        },
        {
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
      ],
    },
  });

  if (duplicateCategory) {
    return {
      success: false,
      message: 'Category already exists.',
    };
  }

  await prisma.category.update({
    where: {
      id: categoryId,
    },
    data: {
      name: cleanName,
      slug,
    },
  });

  revalidatePath('/admin/categories');
  redirect('/admin/categories');
}

// =========================
// DELETE CATEGORY
// =========================

export async function deleteCategory(
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

  const categoryId = formData.get('categoryId');

  if (typeof categoryId !== 'string' || !categoryId) {
    return {
      success: false,
      message: 'Category ID is required.',
    };
  }

  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
    select: {
      id: true,
      _count: {
        select: {
          services: true,
        },
      },
    },
  });

  if (!category) {
    return {
      success: false,
      message: 'Category not found.',
    };
  }

  if (category._count.services > 0) {
    return {
      success: false,
      message: 'Category has linked services. Deactivate it instead.',
    };
  }

  await prisma.category.delete({
    where: {
      id: category.id,
    },
  });

  revalidatePath('/admin/categories');

  return {
    success: true,
    message: 'Category deleted successfully.',
  };
}
