'use client';

import Link from 'next/link';
import { useTransition } from 'react';
import { Button, buttonVariants } from '@/components/ui/button';

export function RouteRecovery({ retry, title, href, label }: {
  retry: () => void;
  title: string;
  href: string;
  label: string;
}) {
  const [pending, startTransition] = useTransition();
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <div className="rounded-xl border bg-card p-6" aria-busy={pending}>
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="mt-3 text-sm text-muted-foreground">Please try loading this page again. If you just submitted a request, check its current state before submitting again.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button disabled={pending} onClick={() => startTransition(() => retry())}>{pending ? 'Retrying…' : 'Try Again'}</Button>
          <Link href={href} className={buttonVariants({ variant: 'outline' })}>{label}</Link>
        </div>
        <p role="status" className="sr-only">{pending ? 'Loading page again.' : ''}</p>
      </div>
    </main>
  );
}
