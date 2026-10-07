'use server';

import { revalidatePath } from 'next/cache';

import { getCurrentUser } from '@/lib/auth-user';
import { prisma } from '@/lib/prisma';

export type ProviderVerificationState = {
  success: boolean;
  message: string;
};

export async function toggleProviderVerification(
  _previousState: ProviderVerificationState,
  formData: FormData
): Promise<ProviderVerificationState> {
  const user = await getCurrentUser();

  if (!user || user.role !== 'ADMIN') {
    return {
      success: false,
      message: 'You are not authorized to perform this action.',
    };
  }

  const providerId = formData.get('providerId');

  if (typeof providerId !== 'string' || !providerId) {
    return {
      success: false,
      message: 'Provider ID is required.',
    };
  }

  const provider = await prisma.provider.findUnique({
    where: {
      id: providerId,
    },
    select: {
      id: true,
      isVerified: true,
    },
  });

  if (!provider) {
    return {
      success: false,
      message: 'Provider not found.',
    };
  }

  const updatedProvider = await prisma.provider.update({
    where: {
      id: provider.id,
    },
    data: {
      isVerified: !provider.isVerified,
    },
  });

  revalidatePath('/admin/providers');

  return {
    success: true,
    message: updatedProvider.isVerified
      ? 'Provider verified successfully.'
      : 'Provider verification removed successfully.',
  };
}
