import Link from 'next/link';
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import { Wrench, Calendar, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
            <Wrench className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
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
          {/* Signed Out View */}
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

          {/* Signed In View */}
          <Show when="signed-in">
            <div className="flex items-center gap-4">
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
