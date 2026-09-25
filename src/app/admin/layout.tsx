import type { ReactNode } from 'react';

import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import { getCurrentUser } from '@/lib/auth-user';

type AdminLayoutProps = {
  children: ReactNode;
};

export default async function AdminLayout({ children }: AdminLayoutProps) {
  // Step 1: Clerk authentication check
  const { userId } = await auth();

  // Step 2: Signed out → sign-in page
  if (!userId) {
    redirect('/sign-in?redirect_url=/admin');
  }

  // Step 3: Ab safe hai, kyunki Clerk user signed in hai
  const user = await getCurrentUser();

  // Step 4: Signed in hai, lekin admin nahi hai
  if (user.role !== 'ADMIN') {
    redirect('/');
  }

  // Step 5: Admin hai
  return <>{children}</>;
}
