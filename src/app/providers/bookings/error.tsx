'use client';

import { RouteRecovery } from '@/components/route-recovery';

export default function Error({ retry }: { retry: () => void }) {
  return <RouteRecovery retry={retry} title="Jobs could not be loaded" href="/providers/services" label="My Services" />;
}
