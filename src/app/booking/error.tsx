'use client';

import { RouteRecovery } from '@/components/route-recovery';

export default function Error({ retry }: { retry: () => void }) {
  return <RouteRecovery retry={retry} title="Booking details could not be loaded" href="/my-bookings" label="Check My Bookings" />;
}
