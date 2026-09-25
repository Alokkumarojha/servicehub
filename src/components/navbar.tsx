import Link from 'next/link';
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import {
  Wrench,
  Calendar,
  Sparkles,
  BriefcaseBusiness,
  Settings2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { prisma } from '@/lib/prisma';

export async function Navbar() {
  const { userId } = await auth();

  let isProvider = false;

  if (userId) {
    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
      select: {
        provider: {
          select: {
            id: true,
          },
        },
      },
    });

    isProvider = Boolean(user?.provider);
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="group flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
            <Wrench className="h-5 w-5" />
          </div>

          <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-xl font-bold tracking-tight text-transparent">
            ServiceHub
          </span>
        </Link>

        {/* Central Navigation Links */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Home
          </Link>

          <Link
            href="/services"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Services
          </Link>

          <Link
            href="/providers"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Providers
          </Link>
        </nav>

        {/* Authentication State Controls */}
        <div className="flex items-center gap-3">
          <Show when="signed-out">
            <SignInButton mode="redirect">
              <Button variant="ghost" size="sm" className="font-medium">
                Sign In
              </Button>
            </SignInButton>

            <SignUpButton mode="redirect">
              <Button size="sm" className="gap-1.5 font-medium shadow-xs">
                <Sparkles className="h-3.5 w-3.5" />
                Sign Up
              </Button>
            </SignUpButton>
          </Show>

          <Show when="signed-in">
            <div className="flex items-center gap-4">
              {userId && !isProvider && (
                <Link
                  href="/providers/onboarding"
                  className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  <BriefcaseBusiness className="h-4 w-4" />
                  <span>Become a Provider</span>
                </Link>
              )}

              {/* Provider-only navigation */}
              {isProvider && (
                <>
                  <Link
                    href="/providers/services"
                    className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Settings2 className="h-4 w-4" />
                    <span>My Services</span>
                  </Link>

                  <Link
                    href="/providers/bookings"
                    className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <BriefcaseBusiness className="h-4 w-4" />
                    <span>Jobs</span>
                  </Link>
                </>
              )}

              <Link
                href="/my-bookings"
                className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <Calendar className="h-4 w-4" />
                <span>My Bookings</span>
              </Link>

              <div className="h-5 w-px bg-border" />

              <UserButton
                appearance={{
                  elements: {
                    avatarBox:
                      'h-9 w-9 ring-2 ring-primary/10 transition-transform hover:scale-105',
                  },
                }}
              />
            </div>
          </Show>
        </div>
      </div>
    </header>
  );
}
