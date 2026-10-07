import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NavbarNavigation } from '@/components/navbar-navigation';

export async function Navbar() {
  const { userId } = await auth();

  let isProvider = false;
  let isAdmin = false;

  if (userId) {
    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
      select: {
        role: true,
        provider: {
          select: {
            id: true,
          },
        },
      },
    });

    isAdmin = user?.role === 'ADMIN';
    isProvider = Boolean(user?.provider);
  }

  const capabilityLinks = [];
  if (userId) {
    capabilityLinks.push({ href: '/my-bookings', label: 'My Bookings' });
    if (!isProvider && !isAdmin) {
      capabilityLinks.push({ href: '/providers/onboarding', label: 'Become a Provider' });
    }
    if (isProvider) {
      capabilityLinks.push(
        { href: '/providers/services', label: 'My Services' },
        { href: '/providers/bookings', label: 'Jobs' },
      );
    }
    if (isAdmin) {
      capabilityLinks.push({ href: '/admin', label: 'Admin Dashboard' });
    }
  }

  return <NavbarNavigation capabilityLinks={capabilityLinks} />;
}