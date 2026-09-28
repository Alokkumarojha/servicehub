import { prisma } from '@/lib/prisma';

import ServicesList from './services-list';

export default async function ServicesPage() {
  const categories = await prisma.category.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      name: 'asc',
    },
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });

  return <ServicesList categories={categories} />;
}
