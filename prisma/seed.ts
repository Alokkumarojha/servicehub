import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  const electrical = await prisma.category.upsert({
    where: {
      slug: 'electrical',
    },
    update: {},
    create: {
      name: 'Electrical',
      slug: 'electrical',
    },
  });

  const plumbing = await prisma.category.upsert({
    where: {
      slug: 'plumbing',
    },
    update: {},
    create: {
      name: 'Plumbing',
      slug: 'plumbing',
    },
  });

  const acRepair = await prisma.category.upsert({
    where: {
      slug: 'ac-repair',
    },
    update: {},
    create: {
      name: 'AC Repair',
      slug: 'ac-repair',
    },
  });

  const providerUser = await prisma.user.upsert({
    where: {
      clerkId: 'seed_provider_rahul',
    },
    update: {},
    create: {
      clerkId: 'seed_provider_rahul',
      name: 'Rahul Kumar',
      email: 'rahul@example.com',
      role: 'PROVIDER',
    },
  });

  const provider = await prisma.provider.upsert({
    where: {
      userId: providerUser.id,
    },
    update: {},
    create: {
      userId: providerUser.id,
      bio: 'Experienced electrician providing reliable electrical services.',
      experience: 5,
      isVerified: true,
    },
  });

  await prisma.service.createMany({
    data: [
      {
        providerId: provider.id,
        categoryId: electrical.id,
        title: 'Electrical Repair',
        description: 'Electrical installation, repair and maintenance.',
        price: 500,
      },
      {
        providerId: provider.id,
        categoryId: electrical.id,
        title: 'Fan Installation',
        description: 'Ceiling and wall fan installation service.',
        price: 300,
      },
      {
        providerId: provider.id,
        categoryId: electrical.id,
        title: 'Wiring',
        description: 'Home electrical wiring and repair.',
        price: 1000,
      },
    ],
  });

  console.log('Database seeded successfully.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
