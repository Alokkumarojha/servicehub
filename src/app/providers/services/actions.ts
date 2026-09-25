'use server';

import { revalidatePath } from 'next/cache';

import { getCurrentUser } from '@/lib/auth-user';
import { prisma } from '@/lib/prisma';

export async function toggleServiceStatus(
  serviceId: string,
  nextStatus: boolean
) {
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

  const result = await prisma.service.updateMany({
    where: {
      id: serviceId,
      providerId: provider.id,
    },
    data: {
      isActive: nextStatus,
    },
  });

  if (result.count === 0) {
    throw new Error(
      'Service not found or you do not have permission to update it.'
    );
  }

  revalidatePath('/providers/services');
}

export async function deleteService(serviceId: string) {
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

  const service = await prisma.service.findFirst({
    where: {
      id: serviceId,
      providerId: provider.id,
    },
    select: {
      id: true,
      _count: {
        select: {
          bookings: true,
        },
      },
    },
  });

  if (!service) {
    throw new Error(
      'Service not found or you do not have permission to delete it.'
    );
  }

  if (service._count.bookings > 0) {
    throw new Error(
      'This service has booking history and cannot be deleted. Deactivate it instead.'
    );
  }

  await prisma.service.delete({
    where: {
      id: service.id,
    },
  });

  revalidatePath('/providers/services');
}
