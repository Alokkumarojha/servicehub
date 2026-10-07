'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import { Menu, Wrench, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { NavigationLink } from '@/components/navigation-link';

type Destination = { href: string; label: string };
const publicLinks: Destination[] = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/providers', label: 'Providers' },
];

export function NavbarNavigation({ capabilityLinks }: { capabilityLinks: Destination[] }) {
  const pathname = usePathname();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1280px)');
    const closeOnDesktop = () => { if (desktop.matches) setOpenPath(null); };
    desktop.addEventListener('change', closeOnDesktop);
    return () => desktop.removeEventListener('change', closeOnDesktop);
  }, []);

  function closeMenu() { setOpenPath(null); }

  return (
    <header
      className="sticky top-0 z-50 w-full border-b bg-background"
      onKeyDown={(event) => {
        if (event.key === 'Escape' && open) {
          event.preventDefault();
          closeMenu();
          trigger.current?.focus();
        }
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) closeMenu();
      }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4 sm:px-6 lg:px-8 xl:gap-4">
        <Link href="/" onNavigate={closeMenu} className="flex min-h-11 shrink-0 items-center gap-2 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Wrench className="size-5" aria-hidden="true" /></span>
          <span className="text-lg font-semibold tracking-tight sm:text-xl">ServiceHub</span>
        </Link>
        <nav aria-label="Main navigation" className="hidden shrink-0 items-center gap-1 whitespace-nowrap xl:flex">
          {publicLinks.map((link) => <NavigationLink key={link.href} href={link.href} exact>{link.label}</NavigationLink>)}
        </nav>
        <div className="ml-auto flex shrink-0 items-center gap-2">
          <Show when="signed-in">
            <nav aria-label="Your workspace" className="hidden items-center gap-1 whitespace-nowrap xl:flex">
              {capabilityLinks.map((link) => <NavigationLink key={link.href} href={link.href}>{link.label}</NavigationLink>)}
            </nav>
          </Show>
          <Show when="signed-out">
            <div className="hidden items-center gap-2 xl:flex">
              <SignInButton mode="redirect"><Button variant="ghost">Sign In</Button></SignInButton>
              <SignUpButton mode="redirect"><Button>Sign Up</Button></SignUpButton>
            </div>
          </Show>
          <Show when="signed-in">
            <div className="flex min-h-11 min-w-11 items-center justify-center">
              <UserButton appearance={{ elements: { avatarBox: 'h-11 w-11', userButtonTrigger: 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring' } }} />
            </div>
          </Show>
          <Button ref={trigger} variant="outline" size="icon" className="xl:hidden" aria-label={open ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpenPath(open ? null : pathname)}>
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </Button>
        </div>
      </div>
      <div id="mobile-navigation" hidden={!open} className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t px-4 py-3 xl:hidden">
        <nav aria-label="Mobile navigation" className="space-y-1">
          {publicLinks.map((link) => <NavigationLink key={link.href} href={link.href} exact onNavigate={closeMenu}>{link.label}</NavigationLink>)}
          <Show when="signed-in">
            <div className="mt-3 space-y-1 border-t pt-3">
              {capabilityLinks.map((link) => <NavigationLink key={link.href} href={link.href} onNavigate={closeMenu}>{link.label}</NavigationLink>)}
            </div>
          </Show>
        </nav>
        <Show when="signed-out">
          <div className="mt-3 grid grid-cols-2 gap-3 border-t pt-3">
            <SignInButton mode="redirect"><Button variant="outline" onClick={closeMenu}>Sign In</Button></SignInButton>
            <SignUpButton mode="redirect"><Button onClick={closeMenu}>Sign Up</Button></SignUpButton>
          </div>
        </Show>
      </div>
    </header>
  );
}
