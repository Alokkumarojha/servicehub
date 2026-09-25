'use server';

import { redirect } from 'next/navigation';

import { getCurrentUser } from '@/lib/auth-user';
import { prisma } from '@/lib/prisma';

export async function createProviderProfile(formData: FormData) {
  const bio = formData.get('bio');
  const experienceValue = formData.get('experience');

  if (typeof bio !== 'string' || typeof experienceValue !== 'string') {
    throw new Error('Required provider details are missing.');
  }

  const cleanBio = bio.trim();
  const experience = Number(experienceValue);

  if (!cleanBio) {
    throw new Error('Please tell customers about your work.');
  }

  if (!Number.isInteger(experience) || experience < 0 || experience > 60) {
    throw new Error('Please enter valid years of experience.');
  }

  const user = await getCurrentUser();

  const existingProvider = await prisma.provider.findUnique({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
    },
  });

  if (existingProvider) {
    redirect('/providers/services');
  }

  await prisma.$transaction([
    prisma.provider.create({
      data: {
        userId: user.id,
        bio: cleanBio,
        experience,
      },
    }),

    prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        role: 'PROVIDER',
      },
    }),
  ]);

  redirect('/providers/services');
}
