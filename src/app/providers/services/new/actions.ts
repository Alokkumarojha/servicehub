'use server';

import { redirect } from 'next/navigation';

import { getCurrentUser } from '@/lib/auth-user';
import { prisma } from '@/lib/prisma';

export async function createService(formData: FormData) {
  const categoryId = formData.get('categoryId');
  const title = formData.get('title');
  const description = formData.get('description');
  const priceValue = formData.get('price');

  if (
    typeof categoryId !== 'string' ||
    typeof title !== 'string' ||
    typeof priceValue !== 'string'
  ) {
    throw new Error('Required service details are missing.');
  }

  const cleanTitle = title.trim();
  const price = Number(priceValue);

  if (!cleanTitle) {
    throw new Error('Service title is required.');
  }

  if (!Number.isFinite(price) || price <= 0) {
    throw new Error('Please enter a valid service price.');
  }

  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized. Please sign in to create a service.');
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
    throw new Error('Provider profile not found.');
  }

  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
    select: {
      id: true,
    },
  });

  if (!category) {
    throw new Error('Selected category not found.');
  }

  await prisma.service.create({
    data: {
      providerId: provider.id,
      categoryId: category.id,
      title: cleanTitle,
      description:
        typeof description === 'string' ? description.trim() || null : null,
      price,
    },
  });

  redirect('/providers/services');
}
