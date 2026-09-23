'use server';

import { redirect } from 'next/navigation';

import { getCurrentUser } from '@/lib/auth-user';
import { prisma } from '@/lib/prisma';

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
