import { currentUser } from '@clerk/nextjs/server';

import { prisma } from '@/lib/prisma';

export async function getCurrentUser() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    throw new Error('Unauthorized');
  }

  const email = clerkUser.primaryEmailAddress?.emailAddress;

  if (!email) {
    throw new Error('User email not found');
  }

  const name =
    `${clerkUser.firstName ?? ''} ${clerkUser.lastName ?? ''}`.trim() ||
    clerkUser.username ||
    email;

  const phone = clerkUser.primaryPhoneNumber?.phoneNumber;

  const user = await prisma.user.upsert({
    where: {
      clerkId: clerkUser.id,
    },
    update: {
      name,
      email,
      phone,
    },
    create: {
      clerkId: clerkUser.id,
      name,
      email,
      phone,
    },
  });

  return user;
}
