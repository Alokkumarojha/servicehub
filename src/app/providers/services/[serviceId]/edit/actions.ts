'use server';

import { redirect, unstable_rethrow } from 'next/navigation';

import { getCurrentUser } from '@/lib/auth-user';
import { prisma } from '@/lib/prisma';
import type { FormFeedback } from '@/components/action-form';

export async function updateService(serviceId: string, formData: FormData) {
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

  const result = await prisma.service.updateMany({
    where: {
      id: serviceId,
      providerId: provider.id,
    },
    data: {
      categoryId: category.id,
      title: cleanTitle,
      description:
        typeof description === 'string' ? description.trim() || null : null,
      price,
    },
  });

  if (result.count === 0) {
    throw new Error(
      'Service not found or you do not have permission to edit it.'
    );
  }

  redirect('/providers/services');
}

// Presentation adapter: the original action and its business rules stay unchanged.
export async function submitServiceUpdate(serviceId: string, formData: FormData): Promise<FormFeedback> {
  try {
    await updateService(serviceId, formData);
  } catch (error) {
    unstable_rethrow(error);
    const messages: Record<string, [string, string]> = {
  "Required service details are missing.": [
    "",
    "Please fill in the required service details."
  ],
  "Service title is required.": [
    "title",
    "Enter a service title."
  ],
  "Please enter a valid service price.": [
    "price",
    "Enter a price greater than zero."
  ],
  "Selected category not found.": [
    "categoryId",
    "This category is no longer available. Reload to see current categories."
  ],
  "Provider profile not found.": [
    "",
    "A provider profile is required. Return to My Services to continue."
  ],
  "Service not found or you do not have permission to edit it.": [
    "",
    "This service cannot be edited from your account. Return to My Services."
  ]
};
    const expected = error instanceof Error && Object.hasOwn(messages, error.message) ? messages[error.message] : undefined;
    if (expected) {
      const [field, message] = expected;
      return { message, fieldErrors: field ? { [field]: message } : undefined };
    }
    return { message: "We could not confirm your changes were saved. Check My Services before trying again." };
  }
  return { message: "We could not confirm your changes were saved. Check My Services before trying again." };
}
