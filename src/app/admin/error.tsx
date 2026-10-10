'use client';

import { RouteRecovery } from '@/components/route-recovery';

export default function Error({ retry }: { retry: () => void }) {
  return <RouteRecovery retry={retry} title="Admin content could not be loaded" href="/admin" label="Admin Overview" />;
}
