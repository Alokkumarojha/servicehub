'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type NavigationLinkProps = {
  href: string;
  children: React.ReactNode;
  exact?: boolean;
  onNavigate?: () => void;
};

export function NavigationLink({ href, children, exact = false, onNavigate }: NavigationLinkProps) {
  const pathname = usePathname();
  const active = pathname === href || (!exact && pathname.startsWith(`${href}/`));

  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      onNavigate={onNavigate}
      className={`flex min-h-11 items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${active ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
    >
      {children}
    </Link>
  );
}
