'use client';

import { RouteRecovery } from '@/components/route-recovery';

export default function Error({ retry }: { retry: () => void }) {
  return <RouteRecovery retry={retry} title="Bookings could not be loaded" href="/services" label="Browse Services" />;
}
