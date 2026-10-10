'use server';

import { redirect, unstable_rethrow } from 'next/navigation';

import { getCurrentUser } from '@/lib/auth-user';
import { prisma } from '@/lib/prisma';
import type { FormFeedback } from '@/components/action-form';

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

// Presentation adapter: the original action and its business rules stay unchanged.
export async function submitService(formData: FormData): Promise<FormFeedback> {
  try {
    await createService(formData);
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
  "Unauthorized. Please sign in to create a service.": [
    "",
    "Please sign in again before creating a service."
  ]
};
    const expected = error instanceof Error && Object.hasOwn(messages, error.message) ? messages[error.message] : undefined;
    if (expected) {
      const [field, message] = expected;
      return { message, fieldErrors: field ? { [field]: message } : undefined };
    }
    return { message: "We could not confirm the service was created. Check My Services before trying again." };
  }
  return { message: "We could not confirm the service was created. Check My Services before trying again." };
}
