'use server';

import { redirect, unstable_rethrow } from 'next/navigation';

import { getCurrentUser } from '@/lib/auth-user';
import { prisma } from '@/lib/prisma';
import type { FormFeedback } from '@/components/action-form';

export async function createBooking(formData: FormData) {
  const serviceId = formData.get('serviceId');
  const addressId = formData.get('addressId');
  const date = formData.get('date');
  const time = formData.get('time');
  const notes = formData.get('notes');

  if (
    typeof serviceId !== 'string' ||
    typeof addressId !== 'string' ||
    typeof date !== 'string' ||
    typeof time !== 'string'
  ) {
    throw new Error('Required booking details are missing.');
  }

  const user = await getCurrentUser();

  const service = await prisma.service.findUnique({
    where: {
      id: serviceId,
    },
  });

  if (!service) {
    throw new Error('Selected service not found.');
  }

  const address = await prisma.address.findUnique({
    where: {
      id: addressId,
    },
  });

  if (!address) {
    throw new Error('Address not found.');
  }

  if (address.userId !== user.id) {
    throw new Error('You cannot use this address.');
  }

  const scheduledAt = new Date(`${date}T${time}`);

  await prisma.booking.create({
    data: {
      customerId: user.id,
      serviceId: service.id,
      providerId: service.providerId,
      addressId: address.id,
      scheduledAt,
      price: service.price,
      notes: typeof notes === 'string' ? notes.trim() || null : null,
    },
  });

  redirect('/my-bookings');
}

// Presentation adapter: the original action and its business rules stay unchanged.
export async function submitBooking(formData: FormData): Promise<FormFeedback> {
  try {
    await createBooking(formData);
  } catch (error) {
    unstable_rethrow(error);
    const messages: Record<string, [string, string]> = {
  "Required booking details are missing.": [
    "",
    "Please fill in the required booking details."
  ],
  "Selected service not found.": [
    "serviceId",
    "This service is no longer available. Browse providers to choose another service."
  ],
  "Address not found.": [
    "addressId",
    "This address is no longer available. Choose or add an address."
  ],
  "You cannot use this address.": [
    "addressId",
    "Choose an address saved to your account."
  ]
};
    const expected = error instanceof Error && Object.hasOwn(messages, error.message) ? messages[error.message] : undefined;
    if (expected) {
      const [field, message] = expected;
      return { message, fieldErrors: field ? { [field]: message } : undefined };
    }
    return { message: "We could not confirm your booking. Check My Bookings before trying again." };
  }
  return { message: "We could not confirm your booking. Check My Bookings before trying again." };
}
